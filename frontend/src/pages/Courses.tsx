import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CourseCard from '../components/CourseCard';

interface Course {
  title: string;
  photo: string;
  type: string;
  url: string;
  _id: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses`)
      .then(response => {
        setCourses(response.data);
        setFilteredCourses(response.data);
      })
      .catch(error => console.error("Error fetching courses:", error));

    setIsLoading(true);
    axios.get(`http://localhost:5000/api/courses/recommend-courses`, { withCredentials: true })
      .then(response => {
        setRecommendedCourses(response.data.recommended_courses || []);
      })
      .catch(error => console.error("Error fetching recommended courses:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query); // Track the current search input

    if (!query) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleAddCourse = (courseId: string) => {
    axios
      .post(
        `http://localhost:5000/api/my-courses/add`,
        { course_id: courseId },
        { withCredentials: true }
      )
      .then(() => {
        alert("Course added to your list!");
      })
      .catch((err) => {
        console.error("Add course error:", err);
        alert("Something went wrong.");
      });
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />

      {/* Recommended Section only shows when search bar is empty */}
      {searchQuery.trim() === "" && recommendedCourses.length > 0 && (
        <div className="p-4">
          <h2 className="text-4xl font-bold mb-4">Recommended Courses</h2>
          <div className="grid grid-cols-4 gap-4">
            {recommendedCourses.map((course) => (
              <CourseCard
                key={course._id}
                _id={course._id}
                title={course.title || "Untitled"}
                photo={course.photo || "https://via.placeholder.com/150"}
                type={course.type || "Unknown"}
                url={course.url || "#"}
                onAdd={() => handleAddCourse(course._id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        <h2 className="text-4xl font-bold mb-4">All Courses</h2>
        <div className="grid grid-cols-4 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              _id={course._id}
              title={course.title || "Untitled"}
              photo={course.photo || "https://via.placeholder.com/150"}
              type={course.type || "Unknown"}
              url={course.url || "#"}
              onAdd={() => handleAddCourse(course._id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Courses;
