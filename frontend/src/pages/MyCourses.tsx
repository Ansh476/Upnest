import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

interface Course {
  title: string;
  photo: string;
  type: string;
  url: string;
  _id: string;
}

const MyCourses: React.FC = () => {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/my-courses/get-courses', { withCredentials: true })
      .then(response => {
        setMyCourses(response.data.courses || []);
      })
      .catch(error => {
        console.error("Error fetching My Courses:", error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleRemoveCourse = (courseId: string) => {
    axios
    .delete('http://localhost:5000/api/my-courses/remove', {
        data: { course_id: courseId },
        withCredentials: true,
      })
      .then(() => {
        setMyCourses((prevCourses) =>
          prevCourses.filter(course => course._id !== courseId)
        );
        alert("Course removed from your list!");
      })
      .catch((err) => {
        console.error("Remove course error:", err);
        alert("Something went wrong.");
      });
  };

  return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : myCourses.length === 0 ? (
          <p>No courses added yet.</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {myCourses.map((course) => (
              <CourseCard
                key={course._id}
                _id={course._id}
                title={course.title || "Untitled"}
                photo={course.photo || "https://via.placeholder.com/150"}
                type={course.type || "Unknown"}
                url={course.url || "#"}
                inMyCourses={true}
                onRemove={() => handleRemoveCourse(course._id)}
              />
            ))}
          </div>
        )}
      </div>
  );
};

export default MyCourses;
