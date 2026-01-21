package com.example.student.service;
import java.util.List;

import com.example.student.model.Student;

public interface StudentService {
	Student createStudent(Student student);
	Student getStudentById(Long id);
	List<Student> getAllStudents();
	Student updateStudent(Long id, Student student);
	void deleteStudent(Long id);
	Student updatedStudent(Long id, Student studentDetails);
}
