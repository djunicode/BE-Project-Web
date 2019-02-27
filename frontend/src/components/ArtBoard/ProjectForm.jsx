import React from "react";

import { Formik } from "formik";
import * as Yup from "yup";

const ProjectForm = () => {
  return (
    <div className="container">
      <Formik
        initialValues={{
          name: "",
          c1: "",
          c2: "",
          c3: "",
          c4: "",
          year: 1970,
          domain: "",
          teacher: ""
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 500);
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("Required"),
          c1: Yup.string().required("Required"),
          c2: Yup.string().required("Required"),
          c3: Yup.string().required("Required"),
          c4: Yup.string(),
          year: Yup.number().required("Required"),
          domain: Yup.string().required("Required"),
          teacher: Yup.string().required("Required")
        })}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset
          } = props;
          return (
            <form onSubmit={handleSubmit} className="form-group">
              <div className="row">
                <div className="col-6">
                  {/* Project Name */}
                  <div className="col">
                    <input
                      id="projectName"
                      placeholder="Project Name"
                      type="text"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control form-control-md"
                    />
                  </div>
                  <br />
                  <br />
                  {/* Contributor name 1 */}
                  <div className="col">
                    <input
                      id="contributorName1"
                      placeholder="Contributor Name"
                      type="text"
                      value={values.c1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control form-control-md"
                    />
                  </div>
                  {/* Contributor name 2 */}
                  <div className="col">
                    <input
                      id="contributorName2"
                      placeholder="Contributor Name"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control form-control-md"
                    />
                  </div>
                  {/* Contributor name 3 */}
                  <div className="col">
                    <input
                      id="contributorName3"
                      placeholder="Contributor Name"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control form-control-md"
                    />
                  </div>
                  {/* Contributor name 4 */}
                  <div className="col">
                    <input
                      id="contributorName4"
                      placeholder="Contributor Name"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control form-control-md"
                    />
                  </div>
                </div>

                <div className="col-6">
                  {/* Year */}
                  <div className="col">
                    <input
                      id="year"
                      placeholder="year"
                      type="number"
                      value={values.year}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      max="2050"
                      min="1995"
                      style={{ alignContent: "top" }}
                      className="form-control form-control-md"
                    />
                  </div>
                  <br />
                  <br />
                  {/* Domain */}
                  <div className="col">
                    <input
                      id="domain"
                      placeholder="Domain"
                      type="text"
                      value={values.domain}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control form-control-md"
                    />
                  </div>
                  <br />
                  <br />
                  <br/>

                  {/* Teacher */}
                  <div className="col">
                    <input
                      id="teacher"
                      placeholder="Teacher"
                      type="text"
                      value={values.teacher}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control form-control-md"
                    />
                  </div>
                </div>
              </div>
              <hr/>
              <div className="text-center">
                  <button type="submit" value="" name="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProjectForm;
