import React, { useState, useEffect } from "react";

const CourseForm = ({ course, onSubmit, onCancel, loading }) => {
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

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
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
    }
  }, [course]);

  const handleSubmit = (e) => {
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

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            setFormData({ ...formData, description: e.target.value })
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
          required={!course}
        />
        {course && (
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to keep current image
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Registration Link
        </label>
        <input
          type="url"
          value={formData.registrationLink}
          onChange={(e) =>
            setFormData({ ...formData, registrationLink: e.target.value })
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
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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

      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-3 bg-[#ff6a00d6] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : course ? "Update Course" : "Create Course"}
        </button>
      </div>
    </form>
  );
};
export default CourseForm;
