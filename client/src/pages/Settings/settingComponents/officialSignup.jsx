import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import axiosInstance from "@lib/axios";
import { AuthContextProvider } from "@context/AuthContext";
import styles from "@styles/officialSettings.module.scss";

const OfficialSignup = () => {
  const { isSkSuperAdmin } = AuthContextProvider();

  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    official_position: "",
    role: "natural_official",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    contact_number: "",
    gender: "",
    age: "",
  });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupStatus, setSignupStatus] = useState("");

  const handleSignupChange = (field) => (e) => {
    setSignupForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleOfficialSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupStatus("");

    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupStatus("Passwords do not match");
      setSignupLoading(false);
      return;
    }

    if (signupForm.password.length < 6) {
      setSignupStatus("Password must be at least 6 characters long");
      setSignupLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post(
        "/auth/adminSignup",
        signupForm,
      );
      setSignupStatus("Official registered successfully!");
      setSignupForm({
        email: "",
        password: "",
        confirmPassword: "",
        official_position: "",
        role: "natural_official",
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        contact_number: "",
        gender: "",
        age: "",
      });
    } catch (err) {
      setSignupStatus(
        err.response?.data?.message || "Failed to register official",
      );
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <Card className={styles.officialSignupCard}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          className={styles.officialSignupHeader}
        >
          <PersonAdd className={styles.icon} /> Register New Official
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.officialSignupDescription}
        >
          Add a new official to the system. Only super officials can register
          other officials.
        </Typography>

        {signupStatus && (
          <Alert
            severity={
              signupStatus.includes("error") || signupStatus.includes("Failed")
                ? "error"
                : "success"
            }
            className={styles.officialSignupAlert}
          >
            {signupStatus}
          </Alert>
        )}

        <form
          onSubmit={handleOfficialSignup}
          className={styles.officialSignupForm}
        >
          <div className={styles.formGrid}>
            {/* Personal Information Section */}
            <div className={styles.fullWidth}>
              <Typography variant="subtitle1" className={styles.sectionTitle}>
                Personal Information
              </Typography>
            </div>

            <TextField
              fullWidth
              label="First Name"
              value={signupForm.first_name}
              onChange={handleSignupChange("first_name")}
              required
              className={styles.textField}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={signupForm.last_name}
              onChange={handleSignupChange("last_name")}
              required
              className={styles.textField}
            />
            <TextField
              fullWidth
              label="Middle Name"
              value={signupForm.middle_name}
              onChange={handleSignupChange("middle_name")}
              className={styles.textField}
            />
            <TextField
              fullWidth
              label="Suffix"
              value={signupForm.suffix}
              onChange={handleSignupChange("suffix")}
              className={styles.textField}
            />

            <FormControl fullWidth className={styles.selectContainer}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={signupForm.gender}
                onChange={handleSignupChange("gender")}
                label="Gender"
                className={styles.selectField}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Age"
              type="number"
              value={signupForm.age}
              onChange={handleSignupChange("age")}
              className={styles.textField}
            />

            {/* Official Information Section */}
            <div className={styles.fullWidth}>
              <Typography variant="subtitle1" className={styles.sectionTitle}>
                Official Information
              </Typography>
            </div>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={signupForm.email}
              onChange={handleSignupChange("email")}
              required
              className={styles.textField}
            />
            <TextField
              fullWidth
              label="Official Position"
              value={signupForm.official_position}
              onChange={handleSignupChange("official_position")}
              required
              className={styles.textField}
            />

            <FormControl fullWidth required className={styles.selectContainer}>
              <InputLabel>Role</InputLabel>
              <Select
                value={signupForm.role}
                onChange={handleSignupChange("role")}
                label="Role"
                className={styles.selectField}
              >
                <MenuItem value="natural_official">Natural Official</MenuItem>
                {isSkSuperAdmin && (
                  <MenuItem value="super_official">Super Official</MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Contact Number"
              value={signupForm.contact_number}
              onChange={handleSignupChange("contact_number")}
              className={styles.textField}
            />

            {/* Security Section */}
            <div className={styles.fullWidth}>
              <Typography variant="subtitle1" className={styles.sectionTitle}>
                Security
              </Typography>
            </div>

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={signupForm.password}
              onChange={handleSignupChange("password")}
              required
              className={styles.textField}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={signupForm.confirmPassword}
              onChange={handleSignupChange("confirmPassword")}
              required
              className={styles.textField}
            />

            {/* Submit Button */}
            <div className={styles.fullWidth}>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  signupLoading ||
                  !signupForm.email ||
                  !signupForm.password ||
                  !signupForm.first_name ||
                  !signupForm.last_name
                }
                className={styles.submitButton}
              >
                {signupLoading ? "Registering..." : "Register Official"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OfficialSignup;
