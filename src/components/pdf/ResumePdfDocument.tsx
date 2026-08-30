import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData, ResumeSettings, SectionMeta } from '../../types/resume';
import { TEMPLATES, type TemplateTokens } from '../../store/templates';
import { PDF_FONT_FAMILY, MARGIN_PX } from '../../utils/settingsPresets';
import { dateRange, getVisibleSections } from '../../utils/resumeSections';

// Base-14 PDF fonts only (Helvetica/Times/Courier): no embedding needed,
// renders identically everywhere, and stays firmly in "conventional resume
// typeface" territory that ATS parsers handle best.
function makeStyles(settings: ResumeSettings) {
  const font = PDF_FONT_FAMILY[settings.fontFamily];
  const fs = (base: number) => base * settings.fontSizeScale;
  const hs = (base: number) => base * settings.headingScale;
  return StyleSheet.create({
    page: {
      padding: MARGIN_PX[settings.margin],
      fontFamily: font.regular,
      fontSize: fs(10.5),
      lineHeight: settings.lineSpacing,
      color: '#1a1a1a',
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    headerRowReversed: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    name: { fontSize: hs(20), fontFamily: font.bold, color: '#111111', lineHeight: 1.15 },
    title: { fontSize: fs(11.5), color: '#333333', marginTop: 4, lineHeight: 1.15 },
    contactLine: { fontSize: fs(9.5), color: '#444444', marginTop: 6 },
    section: { marginTop: 20 * settings.sectionSpacing },
    entry: { marginBottom: 8 },
    entryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between' },
    entryTitle: { fontSize: fs(11), fontFamily: font.bold, color: '#111111' },
    entryMeta: { fontSize: fs(9.5), color: '#555555' },
    entrySub: { fontSize: fs(10), color: '#333333', marginTop: 1 },
    bulletRow: { flexDirection: 'row', marginTop: 3, paddingLeft: 2 },
    bulletDot: { width: 10, fontSize: fs(10) },
    bulletText: { flex: 1, fontSize: fs(10), color: '#222222' },
    plainText: { fontSize: fs(10.5), color: '#222222' },
  });
}

function PdfHeading({ tokens, headingFs, children }: { tokens: TemplateTokens; headingFs: number; children: string }) {
  const base = { fontSize: headingFs, fontFamily: 'Helvetica-Bold' as const, letterSpacing: tokens.headingTracking };

  if (tokens.headingStyle === 'bar') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <View style={{ width: 3, height: headingFs, backgroundColor: tokens.accent, marginRight: 6 }} />
        <Text style={{ ...base, color: '#111111' }}>{children}</Text>
      </View>
    );
  }
  if (tokens.headingStyle === 'boxed') {
    return (
      <View
        style={{
          alignSelf: 'flex-start',
          backgroundColor: `${tokens.accent}22`,
          paddingVertical: 3,
          paddingHorizontal: 7,
          marginBottom: 6,
          borderRadius: 2,
        }}
      >
        <Text style={{ ...base, color: tokens.accent }}>{children}</Text>
      </View>
    );
  }
  if (tokens.headingStyle === 'underline') {
    return (
      <Text style={{ ...base, color: '#111111', borderBottomWidth: 1, borderBottomColor: tokens.accent, paddingBottom: 3, marginBottom: 6 }}>
        {children}
      </Text>
    );
  }
  return <Text style={{ ...base, color: '#222222', marginBottom: 6 }}>{children}</Text>;
}

export function ResumePdfDocument({ resume, bakedPhotoSrc }: { resume: ResumeData; bakedPhotoSrc: string | null }) {
  const { settings } = resume;
  const styles = makeStyles(settings);
  const tokens = TEMPLATES[resume.templateId];
  const sections = getVisibleSections(resume);
  const { contact } = resume;
  const contactParts = [contact.email, contact.phone, contact.location].filter(Boolean).join('   |   ');
  const linkParts = [contact.linkedin, contact.github, contact.portfolio].filter(Boolean).join('   |   ');
  const label = (text: string) => (tokens.headingCase === 'upper' ? text.toUpperCase() : text);

  return (
    <Document title={contact.fullName || 'Resume'}>
      <Page size="A4" style={styles.page} wrap>
        <View style={tokens.photoAlign === 'left' ? styles.headerRowReversed : styles.headerRow}>
          <View>
            <Text style={[styles.name, { color: tokens.nameColor }]}>{contact.fullName || 'Your Name'}</Text>
            {contact.title ? <Text style={styles.title}>{contact.title}</Text> : null}
            {contactParts ? <Text style={styles.contactLine}>{contactParts}</Text> : null}
            {linkParts ? <Text style={styles.contactLine}>{linkParts}</Text> : null}
          </View>
          {bakedPhotoSrc && resume.photo ? (
            <Image
              src={bakedPhotoSrc}
              style={{
                width: 64,
                height: 64,
                borderRadius: resume.photo.shape === 'circle' ? 32 : 6,
              }}
            />
          ) : null}
        </View>

        {sections.map((section) => (
          <View key={section.id} style={styles.section} wrap={false}>
            <PdfHeading tokens={tokens} headingFs={10.5 * settings.headingScale}>
              {label(section.label)}
            </PdfHeading>
            <PdfSectionBody section={section} resume={resume} tokens={tokens} styles={styles} />
          </View>
        ))}
      </Page>
    </Document>
  );
}

function Bullets({ items, styles }: { items: string[]; styles: ReturnType<typeof makeStyles> }) {
  const filled = items.filter(Boolean);
  if (filled.length === 0) return null;
  return (
    <View>
      {filled.map((b, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

function PdfSectionBody({
  section,
  resume,
  tokens,
  styles,
}: {
  section: SectionMeta;
  resume: ResumeData;
  tokens: TemplateTokens;
  styles: ReturnType<typeof makeStyles>;
}) {
  const dateStyle = { ...styles.entryMeta, color: tokens.accent };

  if (section.kind === 'summary') return <Text style={styles.plainText}>{resume.summary}</Text>;

  if (section.kind === 'experience' || section.kind === 'internships')
    return (
      <>
        {resume[section.kind].map((e) => (
          <View key={e.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeaderRow}>
              <Text style={styles.entryTitle}>
                {e.role}
                {e.company ? `, ${e.company}` : ''}
              </Text>
              <Text style={dateStyle}>{dateRange(e.startDate, e.endDate)}</Text>
            </View>
            {e.location ? <Text style={styles.entrySub}>{e.location}</Text> : null}
            <Bullets items={e.bullets} styles={styles} />
          </View>
        ))}
      </>
    );

  if (section.kind === 'projects')
    return (
      <>
        {resume.projects.map((p) => (
          <View key={p.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeaderRow}>
              <Text style={styles.entryTitle}>
                {p.name}
                {p.techStack ? ` — ${p.techStack}` : ''}
              </Text>
              <Text style={dateStyle}>{dateRange(p.startDate, p.endDate)}</Text>
            </View>
            <Bullets items={p.bullets} styles={styles} />
          </View>
        ))}
      </>
    );

  if (section.kind === 'education')
    return (
      <>
        {resume.education.map((e) => (
          <View key={e.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeaderRow}>
              <Text style={styles.entryTitle}>{e.institution}</Text>
              <Text style={dateStyle}>{dateRange(e.startDate, e.endDate)}</Text>
            </View>
            <Text style={styles.entrySub}>
              {[e.degree, e.field].filter(Boolean).join(' in ')}
              {e.gpa ? ` · GPA ${e.gpa}` : ''}
            </Text>
            {e.description ? <Text style={[styles.plainText, { marginTop: 2 }]}>{e.description}</Text> : null}
          </View>
        ))}
      </>
    );

  if (section.kind === 'technicalSkills') return <Text style={styles.plainText}>{resume.technicalSkills.join('   ·   ')}</Text>;
  if (section.kind === 'softSkills') return <Text style={styles.plainText}>{resume.softSkills.join('   ·   ')}</Text>;
  if (section.kind === 'achievements') return <Bullets items={resume.achievements} styles={styles} />;

  if (section.kind === 'certifications')
    return (
      <>
        {resume.certifications.map((c) => (
          <View key={c.id} style={[styles.entryHeaderRow, { marginBottom: 4 }]} wrap={false}>
            <Text style={styles.plainText}>
              {c.name}
              {c.issuer ? ` — ${c.issuer}` : ''}
            </Text>
            <Text style={dateStyle}>{c.date}</Text>
          </View>
        ))}
      </>
    );

  if (section.kind === 'awards')
    return (
      <>
        {resume.awards.map((a) => (
          <View key={a.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeaderRow}>
              <Text style={styles.entryTitle}>
                {a.title}
                {a.issuer ? ` — ${a.issuer}` : ''}
              </Text>
              <Text style={dateStyle}>{a.date}</Text>
            </View>
            {a.description ? <Text style={styles.entrySub}>{a.description}</Text> : null}
          </View>
        ))}
      </>
    );

  if (section.kind === 'languages')
    return <Text style={styles.plainText}>{resume.languages.map((l) => `${l.name} (${l.proficiency})`).join('   ·   ')}</Text>;

  if (section.kind === 'custom') {
    const cs = resume.customSections.find((c) => c.id === section.customSectionId);
    if (!cs) return null;
    return (
      <>
        {cs.items.map((item) => (
          <View key={item.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeaderRow}>
              <Text style={styles.entryTitle}>{item.title}</Text>
              <Text style={dateStyle}>{item.date}</Text>
            </View>
            {item.subtitle ? <Text style={styles.entrySub}>{item.subtitle}</Text> : null}
            {item.description ? <Text style={[styles.plainText, { marginTop: 1 }]}>{item.description}</Text> : null}
          </View>
        ))}
      </>
    );
  }

  return null;
}
