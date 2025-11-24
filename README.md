# Task Manager – Frontend Case Study

A frontend-only task management application built with **React + TypeScript**, using:

- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Mock Service Worker (MSW)** for mocked backend API
- **Vite** as the build tool

## Features

- Mocked login with static user (`test / test123`) and fake JWT
- Protected dashboard route
- Task CRUD:
  - List tasks
  - Create, edit, delete tasks
  - Status: `todo`, `in-progress`, `done`
- Filter tasks by status
- State persisted via `localStorage`

## Tech Stack

- React + TypeScript (Vite)
- Redux Toolkit, React-Redux
- React Router DOM
- Tailwind CSS
- MSW (Mock Service Worker)
- Axios

## Getting Started

```bash
npm install
npx msw init public/ --save   # only first time
npm run dev
