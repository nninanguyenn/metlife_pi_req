export interface PrivacyPolicy {
    title: string;
    content: string;
    sections: Section[];
}

export interface Section {
    heading: string;
    paragraphs: string[];
}