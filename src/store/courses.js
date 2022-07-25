﻿import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "courses",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    coursesRequested: (courses, action) => {
      courses.loading = true;
    },

    coursesReceived: (courses, action) => {
      courses.list = action.payload;
      courses.loading = false;
    },

    coursesRequestFailed: (courses, action) => {
      courses.loading = false;
    },

    courseSaved: (courses, action) => {
      const savedCourse = action.payload;
      const index = courses.list.findIndex((bug) => bug.id === savedCourse.id);
      courses.list[index] = { ...savedCourse };
      courses.loading = false;
    },
  },
});

export const {
  coursesRequested,
  coursesReceived,
  courseSaved,
  coursesRequestFailed,
} = slice.actions;

console.log(courseSaved(1));
export default slice.reducer;

// Action Creators
const url = "/courses";

export const loadCourses = () => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      onStart: coursesRequested.type,
      onSuccess: coursesReceived.type,
      onError: coursesRequestFailed.type,
    })
  );
};

export const saveCourse = (course) => {
  return apiCallBegan({
    url: url + "/" + course.id,
    method: "patch",
    data: course,
    onSuccess: courseSaved.type,
  });
};

// Selectors
export const getCourses = createSelector(
  (state) => state.entities.courses,
  (courses) => courses.list
);

// export const getCourseBySlug = (state) => (slug) => {
//   return state.entities.courses.list.filter((c) => c.slug === slug)[0];
// };

export const getCourseBySlug = createSelector(
  (state) => state.entities.courses,
  (_, slug) => slug,
  (courses, slug) => {
    return courses.list.filter((c) => c.slug === slug)[0];
  }
);
