import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../forms/FormField';
import FormSelect from '../forms/FormSelect';
import Button from '../ui/Button';

const ProfileForm = ({ user, onSubmit, isLoading, isEditing, onToggleEdit, onCancel }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            phone: '',
            gender: '',
            cnic: '',
            age: '',
            city: '',
            education: '',
            institute: '',
            socialMedia: '',
            skills: '',
            expertise: '',
            priorExperience: '',
            experienceDesc: '',
            availabilityDays: '',
            availabilityHours: ''
        }
    });

    // Load user data when available or when editing starts
    useEffect(() => {
        if (user) {
            const skillsStr = Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || '');
            const expertiseStr = Array.isArray(user.expertise) ? user.expertise.join(', ') : (user.expertise || '');
            const daysStr = Array.isArray(user.availabilityDays) ? user.availabilityDays.join(', ') : (user.availabilityDays || '');

            reset({
                name: user.name || '',
                phone: user.phone || '',
                gender: user.gender || '',
                cnic: user.cnic || '',
                age: user.age || '',
                city: user.city || '',
                education: user.education || '',
                institute: user.institute || '',
                socialMedia: user.socialMedia || '',
                skills: skillsStr,
                expertise: expertiseStr,
                priorExperience: user.priorExperience || '',
                experienceDesc: user.experienceDesc || '',
                availabilityDays: daysStr,
                availabilityHours: user.availabilityHours || ''
            });
        }
    }, [user, reset]);

    const handleFormSubmit = (data) => {
        // Transform comma-separated strings back to arrays
        const formattedData = {
            ...data,
            skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
            expertise: data.expertise ? data.expertise.split(',').map(s => s.trim()).filter(Boolean) : [],
            availabilityDays: data.availabilityDays ? data.availabilityDays.split(',').map(s => s.trim()).filter(Boolean) : []
        };

        onSubmit(formattedData);
    };

    const handleCancel = () => {
        if (user) {
            const skillsStr = Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || '');
            const expertiseStr = Array.isArray(user.expertise) ? user.expertise.join(', ') : (user.expertise || '');
            const daysStr = Array.isArray(user.availabilityDays) ? user.availabilityDays.join(', ') : (user.availabilityDays || '');

            reset({
                name: user.name || '',
                phone: user.phone || '',
                gender: user.gender || '',
                cnic: user.cnic || '',
                age: user.age || '',
                city: user.city || '',
                education: user.education || '',
                institute: user.institute || '',
                socialMedia: user.socialMedia || '',
                skills: skillsStr,
                expertise: expertiseStr,
                priorExperience: user.priorExperience || '',
                experienceDesc: user.experienceDesc || '',
                availabilityDays: daysStr,
                availabilityHours: user.availabilityHours || ''
            });
        }
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    label="Full Name"
                    error={errors.name}
                    disabled={!isEditing}
                    registration={register('name', { required: 'Name is required' })}
                    className={!isEditing ? "opacity-75" : ""}
                    placeholder={isEditing ? "Enter your full name" : ""}
                />

                <FormField
                    label="Email Address"
                    value={user?.email || 'Not provided'}
                    disabled={true}
                    className="opacity-75 cursor-not-allowed bg-gray-50"
                />

                <FormField
                    label="Phone Number"
                    error={errors.phone}
                    disabled={!isEditing}
                    registration={register('phone')}
                    className={!isEditing ? "opacity-75" : ""}
                    placeholder={isEditing ? "Enter your phone number" : ""}
                />

                <FormField
                    label="Role"
                    value={user?.role?.toUpperCase() || 'Not provided'}
                    disabled={true}
                    className="opacity-75 cursor-not-allowed bg-gray-50 capitalize"
                />

                <FormSelect
                    label="Gender"
                    error={errors.gender}
                    disabled={!isEditing}
                    registration={register('gender')}
                    options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'other', label: 'Other' },
                        { value: 'prefer_not_to_say', label: 'Prefer not to say' }
                    ]}
                    placeholder="Select Gender"
                    className={!isEditing ? "opacity-75" : ""}
                />

                <FormField
                    label="CNIC"
                    error={errors.cnic}
                    disabled={!isEditing}
                    registration={register('cnic')}
                    className={!isEditing ? "opacity-75" : ""}
                    placeholder={isEditing ? "Enter CNIC / B-Form" : ""}
                />

                <FormField
                    label="Age"
                    type="number"
                    error={errors.age}
                    disabled={!isEditing}
                    registration={register('age', {
                        min: { value: 13, message: 'Minimum age is 13' },
                        max: { value: 100, message: 'Maximum age is 100' }
                    })}
                    className={!isEditing ? "opacity-75" : ""}
                    placeholder={isEditing ? "Enter age" : ""}
                />

                <FormField
                    label="City"
                    error={errors.city}
                    disabled={!isEditing}
                    registration={register('city')}
                    className={!isEditing ? "opacity-75" : ""}
                    placeholder={isEditing ? "Enter city" : ""}
                />

                <FormField
                    label="Education"
                    error={errors.education}
                    disabled={!isEditing}
                    registration={register('education')}
                    className={!isEditing ? "opacity-75" : ""}
                    placeholder={isEditing ? "Enter education level" : ""}
                />

                <FormField
                    label="Institute"
                    error={errors.institute}
                    disabled={!isEditing}
                    registration={register('institute')}
                    className={!isEditing ? "opacity-75" : ""}
                    placeholder={isEditing ? "Enter institute name" : ""}
                />

                <FormField
                    label="Social Media Profile"
                    error={errors.socialMedia}
                    disabled={!isEditing}
                    registration={register('socialMedia')}
                    className={!isEditing ? "opacity-75" : ""}
                    placeholder={isEditing ? "Enter social media profile link" : ""}
                />

                <div className="md:col-span-2">
                    <FormField
                        label="Skills"
                        textarea
                        rows={3}
                        error={errors.skills}
                        disabled={!isEditing}
                        registration={register('skills')}
                        className={!isEditing ? "opacity-75" : ""}
                        placeholder={isEditing ? "Enter skills separated by commas" : ""}
                    />
                </div>

                <div className="md:col-span-2">
                    <FormField
                        label="Expertise"
                        textarea
                        rows={3}
                        error={errors.expertise}
                        disabled={!isEditing}
                        registration={register('expertise')}
                        className={!isEditing ? "opacity-75" : ""}
                        placeholder={isEditing ? "Enter expertise areas separated by commas" : ""}
                    />
                </div>

                <FormSelect
                    label="Prior Experience"
                    error={errors.priorExperience}
                    disabled={!isEditing}
                    registration={register('priorExperience')}
                    options={[
                        { value: 'yes', label: 'Yes' },
                        { value: 'no', label: 'No' },
                    ]}
                    placeholder="Select Option"
                    className={!isEditing ? "opacity-75" : ""}
                />

                <FormField
                    label="Experience Details"
                    error={errors.experienceDesc}
                    disabled={!isEditing}
                    registration={register('experienceDesc')}
                    className={!isEditing ? "opacity-75" : ""}
                    placeholder={isEditing ? "Briefly describe your experience" : ""}
                />

                <div className="md:col-span-2">
                    <FormField
                        label="Available Days"
                        textarea
                        rows={2}
                        error={errors.availabilityDays}
                        disabled={!isEditing}
                        registration={register('availabilityDays')}
                        className={!isEditing ? "opacity-75" : ""}
                        placeholder={isEditing ? "Enter available days separated by commas (e.g., Monday, Tuesday)" : ""}
                    />
                </div>

                <FormSelect
                    label="Available Hours"
                    error={errors.availabilityHours}
                    disabled={!isEditing}
                    registration={register('availabilityHours')}
                    options={[
                        { value: '2–4 hours per week', label: '2–4 hours per week' },
                        { value: '5–7 hours per week', label: '5–7 hours per week' },
                        { value: '8–10 hours per week', label: '8–10 hours per week' },
                        { value: '10+ hours per week', label: '10+ hours per week' },
                    ]}
                    placeholder="Select Hours"
                    className={!isEditing ? "opacity-75" : ""}
                />
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                {isEditing ? (
                    <>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            variant="primary"
                            className="w-full sm:w-auto"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCancel}
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <Button
                        type="button"
                        onClick={onToggleEdit}
                        variant="primary"
                        className="w-full sm:w-auto"
                    >
                        Edit Profile
                    </Button>
                )}
            </div>
        </form>
    );
};

export default ProfileForm;
