import { gql } from '@apollo/client'
import { TASK_FIELDS } from './queries'

export const CREATE_TASK = gql`
  ${TASK_FIELDS}
  mutation CreateTask($title: String!, $description: String, $status: TaskStatusEnum) {
    createTask(title: $title, description: $description, status: $status) {
      task {
        ...TaskFields
      }
      errors
    }
  }
`

export const UPDATE_TASK = gql`
  ${TASK_FIELDS}
  mutation UpdateTask($id: ID!, $title: String, $description: String, $status: TaskStatusEnum) {
    updateTask(id: $id, title: $title, description: $description, status: $status) {
      task {
        ...TaskFields
      }
      errors
    }
  }
`

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      errors
    }
  }
`

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      apiToken
      errors
      user {
        email
      }
    }
  }
`

export const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      apiToken
      errors
      user {
        email
      }
    }
  }
`
