import React, { useState } from 'react';
import styles from '../styles/PrivacyPage.module.css';
import NewHeader from './NewHeader';

const PrivacyPage: React.FC = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        address: '',
        streetNumber: '',
        streetName: '',
        apt: '',
        city: '',
        state: '',
        zip: '',
        email: '',
        confirmEmail: '',
        residence: '',
        dob: '',
        ssn: '',
        confirmSsn: '',
        verification: 'text',
        phone: '',
        consent: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Form submitted!');
    };

    return (
        <div className={styles.container}>
            <NewHeader />
            <main className={styles.main}>
                <h1 className={styles.title}>Identify the subject of the request</h1>
                <p className={styles.instructions}>
                    Use this form to identify the subject of the personal information request.<br />
                    Enter your identification and contact information below. Prior to submitting a request, please review our <a href="https://www.metlife.com/about-us/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy page</a> to better understand how we use your information.
                </p>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>First Name</label>
                            <input name="firstName" value={form.firstName} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Last Name</label>
                            <input name="lastName" value={form.lastName} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Street Number</label>
                            <input name="streetNumber" value={form.streetNumber} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Street Name</label>
                            <input name="streetName" value={form.streetName} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Apt/Suite # (optional)</label>
                            <input name="apt" value={form.apt} onChange={handleChange} />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>City</label>
                            <input name="city" value={form.city} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>State</label>
                            <input name="state" value={form.state} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Zip Code</label>
                            <input name="zip" value={form.zip} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Confirm Email</label>
                            <input type="email" name="confirmEmail" value={form.confirmEmail} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Primary State or Territory of Residence</label>
                            <input name="residence" value={form.residence} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Date of Birth</label>
                            <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Social Security number</label>
                            <input name="ssn" value={form.ssn} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Confirm Social Security number</label>
                            <input name="confirmSsn" value={form.confirmSsn} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>How would you like to receive your verification code?</label>
                            <select name="verification" value={form.verification} onChange={handleChange}>
                                <option value="text">Text Message (Personal Mobile Number)</option>
                                <option value="voice">Voice Message (Personal Mobile Number/Home Number)</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>{form.verification === 'text' ? 'Personal Mobile Number' : 'Personal Mobile/Home Number'}</label>
                            <input name="phone" value={form.phone} onChange={handleChange} required />
                        </div>
                    </div>
                    {form.verification === 'text' && (
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} required />
                                    I acknowledge that by choosing the text message option, I may incur charges to my mobile plan.
                                </label>
                            </div>
                        </div>
                    )}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Human Body: <span className={styles.humanBodyNote}>We ask this question to protect the site from automated attacks and keep your information secure</span></label>
                            <input name="captcha" disabled placeholder="(CAPTCHA placeholder)" />
                        </div>
                    </div>
                    <div className={styles.buttonRow}>
                        <button type="button" className={styles.cancelBtn}>CANCEL</button>
                        <button type="submit" className={styles.nextBtn}>NEXT</button>
                    </div>
                </form>
            </main>
            <footer className={styles.footer}>
                <a href="https://www.metlife.com/about/privacy-policy/index.html" target="_blank" rel="noopener noreferrer">Privacy</a> |
                <a href="#">Terms of Services</a>
            </footer>
        </div>
    );
};

export default PrivacyPage;