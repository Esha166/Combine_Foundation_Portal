import { useState } from 'react';
import { volunteerService } from '../services/volunteerService';

export const useVolunteerForm = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const initialFormData = {
        name: '',
        email: '',
        phone: '',
        gender: '',
        expertise: [],
        age: '',
        cnic: '',
        city: '',
        education: '',
        institute: '',
        socialMedia: '',
        skills: [],
        customSkill: '', // For custom skill when "Other" is selected
        priorExperience: '',
        experienceDesc: '',
        availabilityDays: [],
        availabilityHours: '',
        termsAgreed: false
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const updateFormData = (updates) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    // Handle multiple skills selection
    const handleSkillChange = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    // Handle availability days selection
    const handleDayChange = (day) => {
        setFormData(prev => ({
            ...prev,
            availabilityDays: prev.availabilityDays.includes(day)
                ? prev.availabilityDays.filter(d => d !== day)
                : [...prev.availabilityDays, day]
        }));
    };

    const resetForm = () => {
        setSuccess(false);
        setFormData(initialFormData);
        setError('');
    };

    const submitApplication = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Map selected skills to expertise areas before submitting
            const skillMapping = {
                'Full Stack Developer / MERN stack Developer': 'Technology',
                'Web / App & Software Development': 'Technology',
                'AI / ML': 'Technology',
                'UI & UX': 'Technology',
                'Search Engine Optimization': 'Marketing',
                'Project Management / Event Management': 'Community Development',
                'Content Creator': 'Marketing',
                'Social Media Management & Digital Marketing': 'Marketing',
                'Graphic Designing': 'Technology',
                'Video Editing': 'Technology',
                'Data Engineer / Data Analyst': 'Technology',
                'Teaching': 'Education',
                'Research & Development': 'Education',
                'Accounting / Finance': 'Finance',
                'Hosting': 'Community Development'
            };

            // Combine standard skills with custom skill to determine expertise
            const allSkills = [...formData.skills];
            if (formData.customSkill.trim() !== '') {
                allSkills.push(formData.customSkill.trim());
            }

            // Map selected skills to expertise categories, removing duplicates
            const expertiseAreas = [...new Set(
                allSkills.map(skill => skillMapping[skill] || 'Other') // Use 'Other' for unmapped skills
            )];

            const submissionData = {
                ...formData,
                expertise: expertiseAreas,
                skills: allSkills // Include all selected skills in the submission
            };

            // Remove the customSkill field since it's just for form handling
            delete submissionData.customSkill;

            // Submit to backend API directly
            await volunteerService.applyVolunteer(submissionData);

            setSuccess(true);
            setFormData(initialFormData);
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                // Handle validation errors from Joi with specific field messages
                const errorMessages = err.response.data.errors.map(error => error.message);
                setError(errorMessages.join(', '));
            } else {
                setError(err.response?.data?.message || 'Failed to submit application. Please check all required fields.');
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        success,
        error,
        handleInputChange,
        updateFormData,
        handleSkillChange,
        handleDayChange,
        submitApplication,
        resetForm
    };
};
