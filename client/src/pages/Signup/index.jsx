import React from 'react';
import styles from '@styles/form.module.scss';



const Form = () => {

    return (
        <form className={styles.form}>

            <section className={styles.section}>
                <h2>PROFILE</h2>

                <div className={styles.row}>
                    <label>Name of Respondent:</label>
                    <div className={styles.name}>
                        <input type="text" placeholder="First Name" />
                        <input type="text" placeholder="Middle Name" />
                        <input type="text" placeholder="Last Name" />
                        <input type="text" placeholder="Suffix" />
                    </div>
                </div>

                <div className={styles.row}>
                    <label>Location:</label>
                    <div className={styles.location}>
                        <input type="text" placeholder="Region" />
                        <input type="text" placeholder="Province" />
                        <input type="text" placeholder="City/Municipality" />
                        <input type="text" placeholder="Barangay" />
                        <input type="text" placeholder="Purok" />
                    </div>
                </div>

                <div className={styles.row}>

                    <div className={styles.inputGroup}>
                        <label>Sex Assigned at Birth:</label>
                        <div className={styles.inlineOptions}>
                            <label><input type="radio" name="sex" value="male" /> Male</label>
                            <label><input type="radio" name="sex" value="female" /> Female</label>
                        </div>
                    </div>
                    <div className={styles.contact}>
                        <input type="text" placeholder="Age" />
                        <input type="date" placeholder="Birthday" />
                        <input type="text" placeholder="Contact Number" />
                        <input type="email" placeholder="Email Address" />

                    </div>

                </div>

            </section>


            <section className={styles.section}>
                <h2>DEMOGRAPHIC CHARACTERS</h2>

                <div className={styles.flexFields}>
                    <fieldset>
                        <legend>Civil Status</legend>
                        {["Single",
                            "Married",
                            "Widowed",
                            "Divorced",
                            "Separated",
                            "Annulled",
                            "Live-in",
                            "Unknown"].map(status => (
                                <label key={status}>
                                    <input type="checkbox" /> {status}
                                </label>
                            ))}
                    </fieldset>

                    <fieldset>
                        <legend>Youth age group</legend>
                        {[
                            "Child Youth (15–17 years old)",
                            "Core Youth (18–24 years old)",
                            "oung Adult (25–30 years old)",
                        ].map(group => (
                            <label key={group}>
                                <input type="checkbox" /> {group}
                            </label>
                        ))}

                    </fieldset>

                    <fieldset>
                        <legend>Youth Classification</legend>
                        {[
                            "In school youth",
                            "Out of school youth",
                            "Working school youth",
                            "Youth w/ Specific needs",
                            "Person w/ Disability",
                            "Children in Conflict w/ Law",
                            "Indigenoues People"
                        ].map(classification => (
                            <label key={classification}>
                                <input type="checkbox" /> {classification}
                            </label>
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend>Educational Background</legend>
                        {[
                            "Elementary Level",
                            "Elementary Grad",
                            "High School Level",
                            "High School Grad",
                            "Vocational Grad",
                            "College Level",
                            "College Grad",
                            "Masters Level",
                            "Masters Grad",
                            "Doctorate Level",
                            "Doctorate Graduate"
                        ].map(level => (
                            <label key={level}>
                                <input type="checkbox" /> {level}
                            </label>
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend>Work Status</legend>
                        {[
                            "Employed",
                            "Unemployed",
                            "Self-Employed",
                            "Currently looking for a job",
                            "Not interested looking for a job"
                        ].map(status => (
                            <label key={status}>
                                <input type="checkbox" /> {status}
                            </label>
                        ))}
                    </fieldset>
                </div>

                <div className={styles.voterSection}>
                    <fieldset>
                        <legend>Voter Information</legend>
                        <div className={styles.voterGrid}>

                            <div className={styles.voterField}>
                                <label>Registered SK Voter:</label>
                                <label><input type="radio" name="sk_voter" value="yes" /> Yes</label>
                                <label><input type="radio" name="sk_voter" value="no" /> No</label>
                            </div>

                            <div className={styles.voterField}>
                                <label>Registered National Voter:</label>
                                <label><input type="radio" name="nat_voter" value="yes" /> Yes</label>
                                <label><input type="radio" name="nat_voter" value="no" /> No</label>
                            </div>

                            <div className={styles.voterField}>
                                <label>Did you vote in the last SK election?</label>
                                <label><input type="radio" name="voted_sk" value="yes" /> Yes</label>
                                <label><input type="radio" name="voted_sk" value="no" /> No</label>
                            </div>

                            <div className={styles.voterField}>
                                <label>Have you attended any SK meetings?</label>
                                <label><input type="radio" name="attended_sk_meeting" value="yes" /> Yes</label>
                                <label><input type="radio" name="attended_sk_meeting" value="no" /> No</label>
                            </div>

                            <div className={styles.voterField}>
                                <label>If yes, how many times?</label>
                                <input type="number" name="sk_meeting_count" min="0" placeholder="e.g. 3" />
                            </div>
                            <div className={styles.voterField}>
                                <label htmlFor="sk_meeting_reason">If no, why not?</label>
                                <textarea
                                    id="sk_meeting_reason"
                                    name="sk_meeting_reason"
                                    placeholder="Reason for not attending"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </fieldset>
                </div>

            </section>

            <button type="submit" className={styles.submitBtn}>Next</button>
        </form>
    );
};

export default Form;
