import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import Button from '../ui/Button';
import LectureBasicInfo from './lectures/LectureBasicInfo';
import LectureMedia from './lectures/LectureMedia';
import LectureSettings from './lectures/LectureSettings';
import { useCreateLecture, useUpdateLecture, useLecture } from '../../hooks/useLectures';

const LectureForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { data: lectureData, isLoading: isLoadingLecture } = useLecture(id);
  const createLectureMutation = useCreateLecture();
  const updateLectureMutation = useUpdateLecture();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      subtitle: '',
      thumbnail: '', // can be URL or File object
      watchLink: '',
      description: '',
      category: '',
      tags: '',
      duration: '',
      isPublic: true
    }
  });

  // Load data for edit mode
  useEffect(() => {
    if (lectureData && lectureData.data) {
      const lecture = lectureData.data;
      reset({
        title: lecture.title || '',
        subtitle: lecture.subtitle || '',
        thumbnail: lecture.thumbnail || '',
        watchLink: lecture.watchLink || '',
        description: lecture.description || '',
        category: lecture.category || '',
        tags: Array.isArray(lecture.tags) ? lecture.tags.join(', ') : lecture.tags || '',
        duration: lecture.duration || '',
        isPublic: lecture.isPublic
      });
    }
  }, [lectureData, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subtitle', data.subtitle || '');
      formData.append('watchLink', data.watchLink);
      formData.append('description', data.description || '');
      formData.append('category', data.category);
      formData.append('tags', data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean).join(',') : '');
      formData.append('duration', data.duration || '');
      formData.append('isPublic', data.isPublic);

      // Handle thumbnail: if it's a File object, append it. If it's a string (URL), API might expect it differently or ignore if we want to keep existing.
      // My backend expects 'thumbnail' field to be file or string?
      // Looking at backend controller: if req.file exists, it uploads. if req.body.thumbnail exists, it uses string?
      // Let's check handleFileChange in original code.
      // Original code: if (thumbnailFile) lectureData.append('thumbnail', thumbnailFile);
      // else if (formData.thumbnail) lectureData.append('thumbnail', formData.thumbnail);

      if (data.thumbnail instanceof File) {
        formData.append('thumbnail', data.thumbnail);
      } else if (typeof data.thumbnail === 'string' && data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
      }

      if (isEdit) {
        await updateLectureMutation.mutateAsync({ id, data: formData });
        navigate('/admin/lectures');
      } else {
        await createLectureMutation.mutateAsync(formData);
        navigate('/admin/lectures');
      }
    } catch (err) {
      console.error('Failed to save lecture:', err);
    }
  };

  const isLoading = createLectureMutation.isPending || updateLectureMutation.isPending || (isEdit && isLoadingLecture);

  // Permission check
  if (!['admin', 'superadmin', 'developer'].includes(user?.role)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-lg">You do not have permission to access this page.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              {isEdit ? 'Edit Lecture' : 'Create New Lecture'}
            </h1>
            <GoBackButton className="text-white" />
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <LectureBasicInfo register={register} errors={errors} />

              <LectureMedia
                register={register}
                errors={errors}
                control={control}
                thumbnailPreview={lectureData?.data?.thumbnail}
              />

              <LectureSettings
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />

              <div className="flex space-x-4 pt-6 border-t border-gray-100">
                <Button
                  type="submit"
                  isLoading={createLectureMutation.isPending || updateLectureMutation.isPending}
                  variant="primary"
                  className="w-full sm:w-auto px-8"
                >
                  {isEdit ? 'Update Lecture' : 'Create Lecture'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureForm;