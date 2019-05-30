/** @jsx jsx */
import { memo, useEffect, useState } from 'react';
import * as yup from 'yup';
import { add, mergeLeft, has, pluck, range } from 'ramda';
import { Global, css, jsx } from '@emotion/core';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const GLOBAL_STYLE = css`
@import url('https://fonts.googleapis.com/css?family=Pridi');
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

body {
  background: #EC7357;
  font-family: "Pridi", serif;
}
`;

const FORMS = [
  [
    {
      type: 'text',
      name: 'firstName',
      description: 'Type your first name',
      validation: yup.string().required()
    },
    {
      type: 'text',
      name: 'lastName',
      description: 'Type your last name',
      validation: yup.string().required()
    }
  ],
  [
    // {
    //   type: 'number',
    //   name: 'birthYear',
    //   description: 'Type the year of your birth',
    //   validation: yup.number().max(1900 + (new Date().getYear())).integer().required()
    // },
    {
      type: 'select',
      name: 'birthYear',
      description: 'Select the year of your birth',
      validation: yup.number().required(),
      options: range(1900, (new Date()).getYear() + 1901).reverse().reduce(
        (obj, year) => ([ ...obj, {value: year, text: year}]),
        []
      )
    },
    {
      type: 'text',
      name: 'homeTown',
      description: 'Type where you are from',
      validation: yup.string().required()
    }
  ]
]

const useFormSequence = (forms, { FormComponent = <div/>, DisplayComponent = <div/> }) => {
  const [formState, setFormState] = useState({});
  const [currentRoute, setCurrentRoute] = useState(0);

  useEffect(() => {;
    if (Object.keys(formState).length === 0 && currentRoute !== 0) {
      setCurrentRoute(0);
    } else if (
      (pluck('name')(forms[currentRoute])).reduce((truth, current) => !truth ? false : has(current, formState), true)
    ) {
      setCurrentRoute(add(1));
    }
  }, [formState]);

  const updateForm = (form) => setFormState(mergeLeft(form));

  const resetForm = () => setFormState({});

  return currentRoute >= forms.length ? (
    <DisplayComponent data={formState} reset={resetForm} />
  ) : (
    <FormComponent fields={forms[currentRoute]} update={updateForm} />
  );
}

const Project9 = memo(() => {
  return (
    <div css={css`
      text-align: center;
      margin-top: 150px;
    `}>
      <Global styles={GLOBAL_STYLE} />
      {
        useFormSequence(FORMS, {
          DisplayComponent: Results,
          FormComponent: ViewForm
        })
      }
    </div>)
})

// Flesh this out to return other components (<select>, etc)
const FormField = memo((props) => {
  const {
    name,
    description,
    type,
    validation,
    value,
    onChange,
    options,
    ...otherProps
  } = props;

  switch(type) {
    case 'select':
      return (<Field component="select" name={name} { ...otherProps }>
        {options.map(({value, text}, i) => (
          <option value={value} key={i}>{text}</option>
        ))}
      </Field>)
    default:
      return (
        <Field name={name} type={type} {...otherProps} />
      )
  }
  
})

const ViewForm = memo((props) => {
  const {
    fields,
    update
  } = props;

  const schema = yup.object().shape(
    fields.reduce(
      (obj, field) => ({ ...obj, [field.name]: field.validation }),
      {}
    )
  );

  return (
    <div>
      <h1>This is a simple form service built with React</h1>
      <Formik
        initialValues={
          fields.reduce(
            (obj, field) => ({ ...obj, [field.name]: '' }),
            {}
          )
        }
        validationSchema={schema}
        onSubmit={(values, {setSubmitting, resetForm}) => {
          update(values);
          setSubmitting(false);
          resetForm();
        }}
      >{({ isSubmitting, errors }) => (
        <Form css={css`
          margin-top: 35px;
          font-size: 25px;
        `}>
          {
            fields.map((field, i) => (
              <div className="form-group" key={i} css={css`margin-bottom: 35px`}>
                <label htmlFor={field.name}>{field.description}:</label>
                <FormField css={css`margin-left: 15px; width: 300px; `} { ...field } />
                <ErrorMessage name={field.name} component="div" css={css`
                  background: #d9534f;
                  color: white;
                  text-shadow: 1px 1px 0 black;
                  width: 500px;
                  margin: auto;
                  margin-top: 35px;
                  border: 1px solid #9b1818;
                `}/>
              </div>
            ))
          }
          <button className="btn btn-lg btn-success" css={css`margin-top: 5px;`} type="submit" disabled={isSubmitting || Object.keys(errors).length > 0}>Proceed</button>
        </Form>
      )}</Formik>
    </div>
  )
})

const Results = memo((props) => {
  const {
    data,
    reset
  } = props;

  return (
    <div>
      <h1>Hello, {data.firstName} {data.lastName}</h1>
      <h2>You are from {data.homeTown}</h2>
      <h2>You are {((new Date()).getYear() + 1900) - data.birthYear}</h2>
      <p css={css`margin-top: 25px`}><button className="btn btn-lg btn-danger" onClick={reset}>Reset Form</button></p>
    </div>
  )
})

export default Project9;