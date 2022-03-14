import { useState, useEffect } from 'react';

const useForm = (callback, validate) => {
  const [values, setValues] = useState({});
  const [dirty, setDirty] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting && Object.keys(errors).length === 0) {
      callback();
    }
  }, [isSubmitting]);

  const handleChange = (event) => {
    event.persist();

    setValues(values => ({ ...values, [event.target.name]: event.target.value })); 
    setDirty(dirty => ({ ...dirty, [event.target.name]: true }));
    setIsSubmitting(false);
  };

  const handleBlur = (event) => {
    if (event) event.preventDefault();
    
    handleErrors(validate());
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();

    handleErrors(validate(), true);
    setIsSubmitting(true);
  };

  const handleErrors = (validationErrors, force) => {
    let errors = {};

    Object.keys(validationErrors).forEach(field => {
      if (force) {
        setDirty(dirty => ({ ...dirty, [field]: true }));
      }

      if (force || dirty[field]) {
        errors[field] = validationErrors[field];
      }
    });

    setErrors(errors);
  }

  const reset = () => {
    setValues({});
  }

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  }
};

export default useForm;