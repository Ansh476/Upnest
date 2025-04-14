import React from 'react';

interface CourseCardProps {
  _id: string;
  title: string;
  photo: string;
  type: string;
  url: string;
  inMyCourses?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  _id,
  title,
  photo,
  type,
  url,
  inMyCourses = false,
  onAdd,
  onRemove,
}) => {
  return (
    <div className="border-2 border-[#E6EFF0] rounded shadow-md p-4 flex flex-col justify-between">
      <div>
        <img src={photo} alt={title} className="w-full h-40 object-cover rounded" />
        <h3 className="mt-2 text-lg font-bold">{title}</h3>
        <p className="text-lg text-gray-300">{type}</p>
      </div>

      <div className="mt-4 space-y-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center px-4 py-2 bg-[#E6EFF0] text-[#203a43] text-lg font-semibold rounded"
        >
          View Course
        </a>

        {inMyCourses ? (
          <button
            onClick={onRemove}
            className="w-full px-4 py-2 bg-red-400 text-white rounded"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={onAdd}
            className="w-full px-4 py-2 bg-green-400 text-white rounded"
          >
            Add to My Courses
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
