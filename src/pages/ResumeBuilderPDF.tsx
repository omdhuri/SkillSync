/**
 * ResumeBuilderPDF.tsx
 * Clean, ATS-friendly PDF generation using @react-pdf/renderer.
 * No browser headers, no watermarks, one-click download.
 */
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Link,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';
import type { ResumeData } from '../lib/types';

// ─── Shared helpers ────────────────────────────────────────────────────────────
const ensureHttps = (url: string) =>
    url.startsWith('http') ? url : `https://${url}`;

// ─────────────────────────────────────────────────────────────────────────────
// CLASSIC PDF
// ─────────────────────────────────────────────────────────────────────────────
const classicStyles = StyleSheet.create({
    page: { fontFamily: 'Times-Roman', fontSize: 10, paddingHorizontal: 36, paddingVertical: 32, color: '#111', lineHeight: 1.5 },
    name: { fontSize: 18, fontFamily: 'Times-Bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 3 },
    contactRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 4, fontSize: 9, color: '#444', marginBottom: 2 },
    sep: { color: '#aaa', marginHorizontal: 3 },
    linkRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 4, fontSize: 9, marginBottom: 4 },
    sectionTitle: { fontFamily: 'Times-Bold', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 0.8, borderBottomColor: '#444', paddingBottom: 1, marginTop: 8, marginBottom: 4 },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    bold: { fontFamily: 'Times-Bold' },
    italic: { fontFamily: 'Times-Italic', color: '#333' },
    bullet: { flexDirection: 'row', marginBottom: 1 },
    bulletDot: { width: 10, fontSize: 10 },
    bulletText: { flex: 1 },
    muted: { color: '#444', fontSize: 9 },
    divider: { borderBottomWidth: 1.5, borderBottomColor: '#111', marginBottom: 5 },
    link: { color: '#1a56db', textDecoration: 'none' },
});

export function ClassicResumePDF({ data }: { data: ResumeData }) {
    const contacts = [data.personal.email, data.personal.phone, data.personal.location].filter(Boolean);
    const links = [data.personal.linkedin, data.personal.github, data.personal.portfolio].filter(Boolean);
    const s = classicStyles;
    return (
        <Document>
            <Page size="A4" style={s.page}>
                {/* Header */}
                <Text style={s.name}>{data.personal.name}</Text>
                <View style={s.divider} />
                <View style={s.contactRow}>
                    {contacts.map((c, i) => (
                        <Text key={i}>{c}{i < contacts.length - 1 ? '  •  ' : ''}</Text>
                    ))}
                </View>
                {links.length > 0 && (
                    <View style={s.linkRow}>
                        {links.map((l, i) => (
                            <Link key={i} src={ensureHttps(l!)} style={s.link}>{l}{i < links.length - 1 ? '  •  ' : ''}</Link>
                        ))}
                    </View>
                )}

                {/* Summary */}
                {data.summary ? (
                    <View>
                        <Text style={s.sectionTitle}>Professional Summary</Text>
                        <Text style={{ color: '#222', fontSize: 9.5 }}>{data.summary}</Text>
                    </View>
                ) : null}

                {/* Experience */}
                {data.experience.filter(e => e.company).length > 0 && (
                    <View>
                        <Text style={s.sectionTitle}>Experience</Text>
                        {data.experience.filter(e => e.company).map(exp => (
                            <View key={exp.id} style={{ marginBottom: 5 }}>
                                <View style={s.expHeader}>
                                    <Text style={s.bold}>{exp.company}</Text>
                                    <Text style={s.muted}>{exp.date}</Text>
                                </View>
                                <Text style={s.italic}>{exp.role}</Text>
                                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                                    <View key={i} style={s.bullet}>
                                        <Text style={s.bulletDot}>•</Text>
                                        <Text style={s.bulletText}>{b}</Text>
                                    </View>
                                ))}
                                {exp.technologiesUsed && <Text style={{ fontSize: 8.5, color: '#555', marginTop: 1 }}>Tech: {exp.technologiesUsed}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {data.education.filter(e => e.college).length > 0 && (
                    <View>
                        <Text style={s.sectionTitle}>Education</Text>
                        {data.education.filter(e => e.college).map(edu => (
                            <View key={edu.id} style={{ marginBottom: 4 }}>
                                <View style={s.expHeader}><Text style={s.bold}>{edu.college}{edu.university ? `, ${edu.university}` : ''}</Text><Text style={s.muted}>{edu.date}</Text></View>
                                <View style={[s.expHeader, { marginTop: 0 }]}><Text style={s.italic}>{edu.degree}</Text>{edu.gpa ? <Text style={{ fontSize: 9 }}>CGPA: {edu.gpa}</Text> : null}</View>
                                {edu.coursework ? <Text style={{ fontSize: 8.5, color: '#555' }}>Coursework: {edu.coursework}</Text> : null}
                            </View>
                        ))}
                    </View>
                )}

                {/* Projects */}
                {data.projects.filter(p => p.name).length > 0 && (
                    <View>
                        <Text style={s.sectionTitle}>Projects</Text>
                        {data.projects.filter(p => p.name).map(proj => (
                            <View key={proj.id} style={{ marginBottom: 4 }}>
                                <View style={s.expHeader}>
                                    <Text style={s.bold}>
                                        {proj.name}
                                        {proj.liveUrl ? '  ' : ''}{proj.liveUrl ? <Link src={ensureHttps(proj.liveUrl)} style={[s.link, { fontSize: 8 }]}>Live</Link> : ''}
                                        {proj.githubUrl ? '  ' : ''}{proj.githubUrl ? <Link src={ensureHttps(proj.githubUrl)} style={[s.link, { fontSize: 8 }]}>GitHub</Link> : ''}
                                    </Text>
                                    <Text style={s.muted}>{proj.date}</Text>
                                </View>
                                {proj.description ? <Text>{proj.description}</Text> : null}
                                {proj.tech && proj.tech.length > 0 ? <Text style={{ fontSize: 8.5, color: '#555' }}>Tech: {proj.tech.join(', ')}</Text> : null}
                            </View>
                        ))}
                    </View>
                )}

                {/* Certifications */}
                {data.certifications.filter(c => c.name).length > 0 && (
                    <View>
                        <Text style={s.sectionTitle}>Certifications</Text>
                        {data.certifications.filter(c => c.name).map(cert => (
                            <View key={cert.id} style={[s.expHeader, { marginBottom: 2 }]}>
                                <Text><Text style={s.bold}>{cert.name}</Text> — {cert.issuer}</Text>
                                <Text style={s.muted}>{cert.date}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Achievements */}
                {data.achievements.filter(a => a.trim()).length > 0 && (
                    <View>
                        <Text style={s.sectionTitle}>Achievements</Text>
                        {data.achievements.filter(a => a.trim()).map((a, i) => (
                            <View key={i} style={s.bullet}><Text style={s.bulletDot}>•</Text><Text style={s.bulletText}>{a}</Text></View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {(() => {
                    const sc = data.skillCategories;
                    const hasCats = sc && ((sc.languages?.length ?? 0) + (sc.frameworks?.length ?? 0) + (sc.cloudDevops?.length ?? 0) + (sc.databases?.length ?? 0) + (sc.tools?.length ?? 0) > 0);
                    if (hasCats) return (
                        <View>
                            <Text style={s.sectionTitle}>Technical Skills</Text>
                            {sc.languages?.length ? <View style={{ flexDirection: 'row', marginBottom: 2 }}><Text style={{ fontFamily: 'Helvetica-Bold', width: 100 }}>Languages: </Text><Text style={{ flex: 1, color: '#222' }}>{sc.languages.join(', ')}</Text></View> : null}
                            {sc.frameworks?.length ? <View style={{ flexDirection: 'row', marginBottom: 2 }}><Text style={{ fontFamily: 'Helvetica-Bold', width: 100 }}>Frameworks: </Text><Text style={{ flex: 1, color: '#222' }}>{sc.frameworks.join(', ')}</Text></View> : null}
                            {sc.cloudDevops?.length ? <View style={{ flexDirection: 'row', marginBottom: 2 }}><Text style={{ fontFamily: 'Helvetica-Bold', width: 100 }}>Cloud & DevOps: </Text><Text style={{ flex: 1, color: '#222' }}>{sc.cloudDevops.join(', ')}</Text></View> : null}
                            {sc.databases?.length ? <View style={{ flexDirection: 'row', marginBottom: 2 }}><Text style={{ fontFamily: 'Helvetica-Bold', width: 100 }}>Databases: </Text><Text style={{ flex: 1, color: '#222' }}>{sc.databases.join(', ')}</Text></View> : null}
                            {sc.tools?.length ? <View style={{ flexDirection: 'row', marginBottom: 2 }}><Text style={{ fontFamily: 'Helvetica-Bold', width: 100 }}>Tools & Others: </Text><Text style={{ flex: 1, color: '#222' }}>{sc.tools.join(', ')}</Text></View> : null}
                        </View>
                    );
                    if (data.skills) return (
                        <View>
                            <Text style={s.sectionTitle}>Technical Skills</Text>
                            <Text style={{ color: '#222' }}>{data.skills}</Text>
                        </View>
                    );
                    return null;
                })()}
            </Page>
        </Document>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACADEMIC PDF
// ─────────────────────────────────────────────────────────────────────────────
const acaStyles = StyleSheet.create({
    page: { fontFamily: 'Times-Roman', fontSize: 10, paddingHorizontal: 46, paddingVertical: 40, color: '#111', lineHeight: 1.45 },
    name: { fontSize: 17, fontFamily: 'Times-Bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
    contactRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', fontSize: 9, color: '#333', marginBottom: 6 },
    divider: { borderBottomWidth: 1, borderBottomColor: '#000', marginVertical: 4 },
    secTitle: { fontFamily: 'Times-Bold', fontSize: 11, marginTop: 10, marginBottom: 4, borderBottomWidth: 0.8, borderBottomColor: '#333', paddingBottom: 1.5 },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 2 },
    bold: { fontFamily: 'Times-Bold', fontSize: 10 },
    italic: { fontFamily: 'Times-Italic', color: '#444', fontSize: 9.5, marginBottom: 2 },
    bullet: { flexDirection: 'row', marginBottom: 2, paddingLeft: 12 },
    dot: { width: 12, fontSize: 10, position: 'absolute', left: 0 },
    muted: { color: '#555', fontSize: 9 },
    link: { color: '#111', textDecoration: 'none' },
    skillRow: { flexDirection: 'row', marginBottom: 2 },
    skillLabel: { fontFamily: 'Times-Bold', width: 105 },
});

function AcaSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View>
            <Text style={acaStyles.secTitle}>{title}</Text>
            {children}
        </View>
    );
}

export function AcademicResumePDF({ data }: { data: ResumeData }) {
    const sc = data.skillCategories;
    const contacts = [data.personal.phone, data.personal.email, data.personal.location].filter(Boolean);
    const links: { label: string; url: string }[] = [
        data.personal.linkedin ? { label: 'LinkedIn', url: data.personal.linkedin } : null,
        data.personal.github ? { label: 'GitHub', url: data.personal.github } : null,
        data.personal.portfolio ? { label: 'Portfolio', url: data.personal.portfolio } : null,
    ].filter(Boolean) as { label: string; url: string }[];

    // Render contacts then links, dropping a | between them only if necessary
    const hasContacts = contacts.length > 0;
    const hasLinks = links.length > 0;

    return (
        <Document>
            <Page size="A4" style={acaStyles.page}>
                <Text style={acaStyles.name}>{data.personal.name || 'YOUR NAME'}</Text>

                <View style={acaStyles.contactRow}>
                    {contacts.map((c, i) => <Text key={`c${i}`}>{c}{i < contacts.length - 1 ? '  |  ' : ''}</Text>)}
                    {hasContacts && hasLinks ? <Text>  |  </Text> : null}
                    {links.map((l, i) => (
                        <Text key={`l${i}`}><Link src={ensureHttps(l.url)} style={acaStyles.link}>{l.label}</Link>{i < links.length - 1 ? '  |  ' : ''}</Text>
                    ))}
                </View>
                <View style={acaStyles.divider} />

                {/* Summary */}
                {data.summary ? (
                    <AcaSection title="Professional Summary">
                        <Text style={{ color: '#222' }}>{data.summary}</Text>
                    </AcaSection>
                ) : null}

                {/* Technical Skills — categorized */}
                {(sc?.languages?.length || sc?.frameworks?.length || sc?.cloudDevops?.length || sc?.databases?.length || sc?.tools?.length) ? (
                    <AcaSection title="Technical Skills">
                        {sc?.languages?.length ? <View style={acaStyles.skillRow}><Text style={acaStyles.skillLabel}>Languages: </Text><Text style={{ flex: 1 }}>{sc.languages.join(', ')}</Text></View> : null}
                        {sc?.frameworks?.length ? <View style={acaStyles.skillRow}><Text style={acaStyles.skillLabel}>Frameworks: </Text><Text style={{ flex: 1 }}>{sc.frameworks.join(', ')}</Text></View> : null}
                        {sc?.cloudDevops?.length ? <View style={acaStyles.skillRow}><Text style={acaStyles.skillLabel}>Cloud &amp; DevOps: </Text><Text style={{ flex: 1 }}>{sc.cloudDevops.join(', ')}</Text></View> : null}
                        {sc?.databases?.length ? <View style={acaStyles.skillRow}><Text style={acaStyles.skillLabel}>Databases: </Text><Text style={{ flex: 1 }}>{sc.databases.join(', ')}</Text></View> : null}
                        {sc?.tools?.length ? <View style={acaStyles.skillRow}><Text style={acaStyles.skillLabel}>Tools &amp; Others: </Text><Text style={{ flex: 1 }}>{sc.tools.join(', ')}</Text></View> : null}
                    </AcaSection>
                ) : data.skills ? (
                    <AcaSection title="Technical Skills">
                        <Text>{data.skills}</Text>
                    </AcaSection>
                ) : null}

                {/* Experience */}
                {data.experience.filter(e => e.company).length > 0 && (
                    <AcaSection title="Professional Experience">
                        {data.experience.filter(e => e.company).map(exp => (
                            <View key={exp.id} style={{ marginBottom: 5 }}>
                                <View style={acaStyles.expHeader}>
                                    <Text style={acaStyles.bold}>[{exp.role}]</Text>
                                    <Text style={acaStyles.muted}>{exp.date}</Text>
                                </View>
                                <Text style={acaStyles.italic}>{exp.company}</Text>
                                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                                    <View key={i} style={acaStyles.bullet}><Text style={acaStyles.dot}>•</Text><Text style={{ flex: 1 }}>{b}</Text></View>
                                ))}
                                {exp.technologiesUsed ? <Text style={{ fontSize: 8.5, color: '#555', marginTop: 1 }}>Technologies used: {exp.technologiesUsed}</Text> : null}
                            </View>
                        ))}
                    </AcaSection>
                )}

                {/* Projects */}
                {data.projects.filter(p => p.name).length > 0 && (
                    <AcaSection title="Projects">
                        {data.projects.filter(p => p.name).map(proj => (
                            <View key={proj.id} style={{ marginBottom: 4 }}>
                                <View style={acaStyles.expHeader}>
                                    <Text style={acaStyles.bold}>
                                        {proj.name}
                                        {proj.liveUrl ? '  ' : ''}{proj.liveUrl ? <Link src={ensureHttps(proj.liveUrl)} style={[acaStyles.link, { fontSize: 8.5 }]}>Live</Link> : ''}
                                        {proj.githubUrl ? '  ' : ''}{proj.githubUrl ? <Link src={ensureHttps(proj.githubUrl)} style={[acaStyles.link, { fontSize: 8.5 }]}>GitHub</Link> : ''}
                                    </Text>
                                    <Text style={acaStyles.muted}>{proj.date}</Text>
                                </View>
                                {proj.description ? <Text>{proj.description}</Text> : null}
                                {proj.tech && proj.tech.length > 0 ? <Text style={{ fontSize: 8.5, color: '#555' }}>Tech: {proj.tech.join(', ')}</Text> : null}
                            </View>
                        ))}
                    </AcaSection>
                )}

                {/* Education */}
                {data.education.filter(e => e.college).length > 0 && (
                    <AcaSection title="Education">
                        {data.education.filter(e => e.college).map(edu => (
                            <View key={edu.id} style={{ marginBottom: 4 }}>
                                <View style={acaStyles.expHeader}>
                                    <Text style={acaStyles.bold}>{edu.degree}</Text>
                                    <Text style={acaStyles.muted}>{edu.date}</Text>
                                </View>
                                <Text style={acaStyles.italic}>{edu.college}{edu.university ? `, ${edu.university}` : ''}{edu.gpa ? `  CGPA: ${edu.gpa}` : ''}</Text>
                                {edu.coursework ? <Text style={{ fontSize: 8.5, color: '#444' }}>Relevant Coursework: {edu.coursework}</Text> : null}
                            </View>
                        ))}
                    </AcaSection>
                )}

                {/* Certifications */}
                {data.certifications.filter(c => c.name).length > 0 && (
                    <AcaSection title="Certifications">
                        {data.certifications.filter(c => c.name).map(cert => (
                            <View key={cert.id} style={acaStyles.bullet}>
                                <Text style={acaStyles.dot}>•</Text>
                                <Text style={{ flex: 1 }}><Text style={acaStyles.bold}>{cert.name}</Text> from {cert.issuer} ({cert.date})</Text>
                            </View>
                        ))}
                    </AcaSection>
                )}

                {/* Additional Information */}
                {data.achievements.filter(a => a.trim()).length > 0 && (
                    <AcaSection title="Additional Information">
                        {data.achievements.filter(a => a.trim()).map((a, i) => (
                            <View key={i} style={acaStyles.bullet}><Text style={acaStyles.dot}>•</Text><Text style={{ flex: 1 }}>{a}</Text></View>
                        ))}
                    </AcaSection>
                )}
            </Page>
        </Document>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODERN PDF
// ─────────────────────────────────────────────────────────────────────────────
const modStyles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 8.5, paddingHorizontal: 30, paddingVertical: 26, color: '#111', lineHeight: 1.4 },
    header: { borderBottomWidth: 2, borderBottomColor: '#000', paddingBottom: 8, marginBottom: 10 },
    name: { fontSize: 20, fontFamily: 'Helvetica-Bold', letterSpacing: -0.3, marginBottom: 2 },
    role: { fontSize: 9, color: '#333', fontFamily: 'Helvetica-Bold', marginBottom: 2 },
    linksRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
    link: { color: '#1a56db', textDecoration: 'underline' },
    cols: { flexDirection: 'row', gap: 8 },
    left: { flex: 0.58 },
    right: { flex: 0.42, borderLeftWidth: 0.5, borderLeftColor: '#ddd', paddingLeft: 8 },
    secTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8.5, textTransform: 'uppercase', letterSpacing: 0.8, borderBottomWidth: 1.2, borderBottomColor: '#000', paddingBottom: 1, marginTop: 7, marginBottom: 3 },
    expHead: { fontFamily: 'Helvetica-Bold', fontSize: 8.5 },
    expDate: { fontSize: 7.5, color: '#666', marginBottom: 1.5 },
    bullet: { flexDirection: 'row', marginBottom: 1 },
    dot: { width: 8 },
    bold: { fontFamily: 'Helvetica-Bold' },
    italic: { fontFamily: 'Helvetica-Oblique', color: '#444', fontSize: 8 },
});

export function ModernResumePDF({ data }: { data: ResumeData }) {
    const role = data.experience[0]?.role ?? '';
    const links = [
        data.personal.email ? { label: 'Email', url: `mailto:${data.personal.email}` } : null,
        data.personal.phone ? { label: data.personal.phone, url: `tel:${data.personal.phone}` } : null,
        data.personal.github ? { label: 'GitHub', url: data.personal.github } : null,
        data.personal.portfolio ? { label: 'Portfolio', url: data.personal.portfolio } : null,
    ].filter(Boolean) as { label: string; url: string }[];

    return (
        <Document>
            <Page size="A4" style={modStyles.page}>
                {/* Header */}
                <View style={modStyles.header}>
                    <Text style={modStyles.name}>{data.personal.name}</Text>
                    {role ? <Text style={modStyles.role}>{role}{data.personal.location ? ` | ${data.personal.location}` : ''}</Text> : null}
                    <View style={modStyles.linksRow}>
                        {links.map((l, i) => <Link key={i} src={ensureHttps(l.url)} style={modStyles.link}>{l.label}{'  '}</Link>)}
                    </View>
                </View>

                {/* Two columns */}
                <View style={modStyles.cols}>
                    {/* Left */}
                    <View style={modStyles.left}>
                        {data.experience.filter(e => e.company).length > 0 && (
                            <View>
                                <Text style={modStyles.secTitle}>Experience</Text>
                                {data.experience.filter(e => e.company).map(exp => (
                                    <View key={exp.id} style={{ marginBottom: 6 }}>
                                        <Text style={modStyles.expHead}>{exp.company}  |  {exp.role}</Text>
                                        <Text style={modStyles.expDate}>{exp.date}</Text>
                                        {exp.bullets.filter(b => b.trim()).map((b, i) => (
                                            <View key={i} style={modStyles.bullet}><Text style={modStyles.dot}>•</Text><Text style={{ flex: 1, fontSize: 8 }}>{b}</Text></View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        )}
                        {data.projects.filter(p => p.name).length > 0 && (
                            <View>
                                <Text style={modStyles.secTitle}>Projects</Text>
                                {data.projects.filter(p => p.name).map(proj => (
                                    <View key={proj.id} style={{ marginBottom: 5 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={modStyles.bold}>{proj.name}</Text>
                                            <Text style={{ fontSize: 7.5, color: '#666' }}>{proj.date}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 1 }}>
                                            {proj.liveUrl ? <Link src={ensureHttps(proj.liveUrl)} style={modStyles.link}>Live</Link> : null}
                                            {proj.githubUrl ? <Link src={ensureHttps(proj.githubUrl)} style={modStyles.link}>GitHub</Link> : null}
                                        </View>
                                        {proj.description ? <Text style={{ fontSize: 8 }}>{proj.description}</Text> : null}
                                        {proj.tech && proj.tech.length > 0 ? <Text style={{ fontSize: 7.5, color: '#555' }}>Tech: {proj.tech.join(', ')}</Text> : null}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Right */}
                    <View style={modStyles.right}>
                        {(() => {
                            const sc = data.skillCategories;
                            const hasCats = sc && ((sc.languages?.length ?? 0) + (sc.frameworks?.length ?? 0) + (sc.cloudDevops?.length ?? 0) + (sc.databases?.length ?? 0) + (sc.tools?.length ?? 0) > 0);
                            if (hasCats) return (
                                <View>
                                    <Text style={[modStyles.secTitle, { marginTop: 0 }]}>Skills</Text>
                                    {sc.languages?.length ? <View style={{ flexDirection: 'row', marginBottom: 1.5 }}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5 }}>Languages: </Text><Text style={{ flex: 1, fontSize: 8, color: '#333' }}>{sc.languages.join(', ')}</Text></View> : null}
                                    {sc.frameworks?.length ? <View style={{ flexDirection: 'row', marginBottom: 1.5 }}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5 }}>Frameworks: </Text><Text style={{ flex: 1, fontSize: 8, color: '#333' }}>{sc.frameworks.join(', ')}</Text></View> : null}
                                    {sc.cloudDevops?.length ? <View style={{ flexDirection: 'row', marginBottom: 1.5 }}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5 }}>Cloud & DevOps: </Text><Text style={{ flex: 1, fontSize: 8, color: '#333' }}>{sc.cloudDevops.join(', ')}</Text></View> : null}
                                    {sc.databases?.length ? <View style={{ flexDirection: 'row', marginBottom: 1.5 }}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5 }}>Databases: </Text><Text style={{ flex: 1, fontSize: 8, color: '#333' }}>{sc.databases.join(', ')}</Text></View> : null}
                                    {sc.tools?.length ? <View style={{ flexDirection: 'row', marginBottom: 1.5 }}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5 }}>Tools & Others: </Text><Text style={{ flex: 1, fontSize: 8, color: '#333' }}>{sc.tools.join(', ')}</Text></View> : null}
                                </View>
                            );
                            if (data.skills) return (
                                <View>
                                    <Text style={[modStyles.secTitle, { marginTop: 0 }]}>Skills</Text>
                                    <Text style={{ fontSize: 8, color: '#333' }}>{data.skills}</Text>
                                </View>
                            );
                            return null;
                        })()}
                        {data.education.filter(e => e.college).length > 0 && (
                            <View>
                                <Text style={modStyles.secTitle}>Education</Text>
                                {data.education.filter(e => e.college).map(edu => (
                                    <View key={edu.id} style={{ marginBottom: 4 }}>
                                        <Text style={modStyles.bold}>{edu.college}{edu.university ? `, ${edu.university}` : ''}</Text>
                                        <Text style={modStyles.italic}>{edu.degree}</Text>
                                        <Text style={{ fontSize: 7.5, color: '#555' }}>{edu.date}{edu.gpa ? `  ·  CGPA: ${edu.gpa}` : ''}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {data.certifications.filter(c => c.name).length > 0 && (
                            <View>
                                <Text style={modStyles.secTitle}>Certifications</Text>
                                {data.certifications.filter(c => c.name).map(cert => (
                                    <View key={cert.id} style={{ marginBottom: 3 }}>
                                        <Text style={modStyles.bold}>{cert.name}</Text>
                                        <Text style={{ fontSize: 7.5, color: '#555' }}>{cert.issuer}  ·  {cert.date}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {data.achievements.filter(a => a.trim()).length > 0 && (
                            <View>
                                <Text style={modStyles.secTitle}>Achievements</Text>
                                {data.achievements.filter(a => a.trim()).map((a, i) => (
                                    <View key={i} style={modStyles.bullet}><Text style={modStyles.dot}>•</Text><Text style={{ flex: 1, fontSize: 8 }}>{a}</Text></View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
}
