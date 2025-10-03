import React from 'react';
import style from '@styles/signup.module.scss';

const BasicInfoStep = ({ formData, errors, onChange }) => {
  const isMobile = window.innerWidth < 600;

  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className={style.container} data-mobile={isMobile}>
      {/* Header Section */}
      <div className={style.headerSection} data-mobile={isMobile}>
        <h1 className={style.title}>Basic Information</h1>
        <h3 className={style.subtitle}>
          Please provide your basic personal information.
        </h3>
      </div>

      {/* Form Fields */}
      <div className={style.formContainer}>
        <div className={style.formGrid} data-mobile={isMobile}>
          {/* First Name */}
          <div className={style.formField}>
            <label
              htmlFor="first_name"
              className={style.label}
              data-required
              data-mobile={isMobile}
            >
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              placeholder="Enter your first name"
              className={`${style.input} ${errors.first_name ? style.errorInput : ''
                }`}
              data-mobile={isMobile}
            />
            {errors.first_name && (
              <span className={style.errorText}>{errors.first_name}</span>
            )}
          </div>

          {/* Middle Name */}
          <div className={style.formField}>
            <label htmlFor="middle_name" className={style.label}>
              Middle Name
            </label>
            <input
              id="middle_name"
              type="text"
              value={formData.middle_name}
              onChange={(e) => handleChange('middle_name', e.target.value)}
              placeholder="Enter your middle name"
              className={`${style.input} ${errors.middle_name ? style.errorInput : ''
                }`}
            />
            {errors.middle_name && (
              <span className={style.errorText}>{errors.middle_name}</span>
            )}
          </div>

          {/* Last Name */}
          <div className={style.formField}>
            <label
              htmlFor="last_name"
              className={style.label}
              data-required
              data-mobile={isMobile}
            >
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              placeholder="Enter your last name"
              className={`${style.input} ${errors.last_name ? style.errorInput : ''
                }`}
              data-mobile={isMobile}
            />
            {errors.last_name && (
              <span className={style.errorText}>{errors.last_name}</span>
            )}
          </div>

          {/* Suffix */}
          <div className={style.formField}>
            <label htmlFor="suffix" className={style.label}>
              Suffix (Jr., Sr., III, etc.)
            </label>
            <input
              id="suffix"
              type="text"
              value={formData.suffix}
              onChange={(e) => handleChange('suffix', e.target.value)}
              placeholder="e.g., Jr., Sr., III"
              className={`${style.input} ${errors.suffix ? style.errorInput : ''
                }`}
            />
            {errors.suffix && (
              <span className={style.errorText}>{errors.suffix}</span>
            )}
          </div>
        </div>

        {/* Gender Section */}
        <div className={style.genderSection} data-mobile={isMobile}>
          <div className={style.genderContainer}>
            <legend className={style.genderLabel} data-mobile={isMobile}>
              Gender
            </legend>
            <div className={style.radioGroup} data-mobile={isMobile}>
              <label className={style.radioOption} data-mobile={isMobile}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={style.radioInput}
                />
                Male
              </label>
              <label className={style.radioOption} data-mobile={isMobile}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={style.radioInput}
                />
                Female
              </label>
            </div>
            {errors.gender && (
              <span className={style.genderError}>{errors.gender}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;