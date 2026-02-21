import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import GoBackButton from "../shared/GoBackButton";
import api from "../../services/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    registrationLink: "",
    socialLink: "",
    category: "",
    duration: "",
    status: "pre-launch",
    totalParticipants: "",
    maleParticipants: "",
    femaleParticipants: "",
    image: null,
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses");
      setCourses(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("description", formData.description);
    data.append("registrationLink", formData.registrationLink);
    data.append("socialLink", formData.socialLink);
    data.append("category", formData.category);
    data.append("duration", formData.duration);
    data.append("status", formData.status);
    if (formData.status === "completed") {
      data.append("totalParticipants", formData.totalParticipants || "0");
      data.append("maleParticipants", formData.maleParticipants || "0");
      data.append("femaleParticipants", formData.femaleParticipants || "0");
    }
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse._id}`, data);
        setMessage("Course updated successfully!");
        setMessageType('success');
      } else {
        await api.post("/courses", data);
        setMessage("Course created successfully!");
        setMessageType('success');
      }

      setShowForm(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error saving course");
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      subtitle: course.subtitle || "",
      description: course.description || "",
      registrationLink: course.registrationLink || "",
      socialLink: course.socialLink || "",
      category: course.category || "",
      duration: course.duration || "",
      status: course.status || "pre-launch",
      totalParticipants: course.totalParticipants ?? "",
      maleParticipants: course.maleParticipants ?? "",
      femaleParticipants: course.femaleParticipants ?? "",
      image: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/courses/${courseId}`);
      setMessage("Course deleted successfully!");
      setMessageType('success');
      fetchCourses();
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting course");
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      registrationLink: "",
      socialLink: "",
      category: "",
      duration: "",
      status: "pre-launch",
      totalParticipants: "",
      maleParticipants: "",
      femaleParticipants: "",
      image: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#FF6900]">
              Course Management
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage training courses
            </p>
          </div>
          <div className="flex space-x-4">
            <GoBackButton />
            <button
              onClick={() => {
                setShowForm(true);
                setEditingCourse(null);
                resetForm();
              }}
              className="px-6 py-3 bg-[#FF6900] text-white font-medium rounded-lg hover:bg-[#ff6a00d6] transition"
            >
              + Add Course
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900] mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      course.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : course.status === 'launched'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(course.status || 'pre-launch').replace('-', ' ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    Category: {course.category || "Uncategorized"}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    Duration: {course.duration || "Not specified"}
                  </p>
                  {course.status === "completed" && (
                    <>
                      <p className="text-sm text-gray-500 mb-1">
                        Total Participants: {course.totalParticipants || 0}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Male Participants: {course.maleParticipants || 0}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        Female Participants: {course.femaleParticipants || 0}
                      </p>
                    </>
                  )}
                  {course.subtitle && (
                    <p className="text-gray-600 text-sm mb-4">
                      {course.subtitle}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex-1 px-4 py-2 bg-[#FF6900] text-white text-sm font-medium rounded-lg hover:bg-[#ff6a00d6]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-[#000000a1] bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingCourse ? "Edit Course" : "Create New Course"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({ ...formData, subtitle: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Image *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={!editingCourse}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Link
                    </label>
                    <input
                      type="url"
                      value={formData.registrationLink}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registrationLink: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media Link
                    </label>
                    <input
                      type="url"
                      value={formData.socialLink}
                      onChange={(e) =>
                        setFormData({ ...formData, socialLink: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Tech, Marketing, Education"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. 8 weeks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pre-launch">Pre-launch</option>
                      <option value="launched">Launched</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {formData.status === "completed" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Participants
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={formData.totalParticipants}
                          onChange={(e) =>
                            setFormData({ ...formData, totalParticipants: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Male Participants
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={formData.maleParticipants}
                          onChange={(e) =>
                            setFormData({ ...formData, maleParticipants: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Female Participants
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={formData.femaleParticipants}
                          onChange={(e) =>
                            setFormData({ ...formData, femaleParticipants: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCourse(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6]"
                  >
                    {editingCourse ? "Update Course" : "Create Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
