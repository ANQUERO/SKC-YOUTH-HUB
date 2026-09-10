import React, { lazy } from "react";

const LandingPage = lazy(() => import("@pages/LandingPage"));
const PrivacyPolicy = lazy(() => import("@pages/LandingPage/privacy/policy"));
const TermsConditions = lazy(() => import("@pages/LandingPage/privacy/terms"));
const Signin = lazy(() => import("@pages/Signin"));
const YouthSignup = lazy(() => import("@pages/YouthSignup"));
const ForgotPassword = lazy(() => import("@pages/ForgotPasword"));
const AdminAuth = lazy(() => import("@pages/AdminAuth"));
const NewsFeed = lazy(() => import("@pages/NewsFeed"));
const Authenticated = lazy(() => import("@pages/Authenticated"));
const Dashboard = lazy(() => import("@pages/Dashboard"));
const Youth = lazy(() => import("@pages/Youth"));
const Purok = lazy(() => import("@pages/Purok"));
const Verification = lazy(() => import("@pages/Verification"));
const Officials = lazy(() => import("@pages/Officials"));
const Settings = lazy(() => import("@pages/Settings"));
const NotFound = lazy(() => import("@pages/NotFound"));
const Inbox = lazy(() => import("@pages/Inbox"));
const YouthSettings = lazy(() => import("@pages/YouthSettings"));
const YouthProfile = lazy(() => import("@pages/YouthProfile"));
const OfficialsProfile = lazy(() => import("@pages/OfficialsProfile"));

import { ProtectedRoute } from "@lib/ProtectedRoute";

export const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-of-service",
    element: <TermsConditions />,
  },
  {
    path: "/login",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <YouthSignup />,
  },
  {
    path: "/forgot",
    element: <ForgotPassword />,
  },
  {
    path: "/feed/*",
    element: (
      <ProtectedRoute
        allowedRoles={["youth", "super_official", "natural_official"]}
      >
        <NewsFeed />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["super_official", "natural_official"]}>
        <Authenticated />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <Dashboard /> }],
  },
  {
    path: "/youth",
    element: (
      <ProtectedRoute allowedRoles={["super_official", "natural_official"]}>
        <Authenticated />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <Youth /> }],
  },
  {
    path: "/purok",
    element: (
      <ProtectedRoute allowedRoles={["super_official", "natural_official"]}>
        <Authenticated />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <Purok /> }],
  },
  {
    path: "/verification",
    element: (
      <ProtectedRoute allowedRoles={["super_official", "natural_official"]}>
        <Authenticated />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <Verification /> }],
  },
  {
    path: "/officials",
    element: (
      <ProtectedRoute allowedRoles={["super_official", "natural_official"]}>
        <Authenticated />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <Officials /> }],
  },
  {
    path: "/inbox",
    element: (
      <ProtectedRoute allowedRoles={["super_official", "natural_official"]}>
        <Authenticated />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <Inbox /> }],
  },
  {
    path: "/account",
    element: (
      <ProtectedRoute allowedRoles={["super_official", "natural_official"]}>
        <Authenticated />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <Settings /> }],
  },
  {
    path: "/admin",
    element: <AdminAuth />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={["youth"]}>
        <YouthProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute allowedRoles={["youth"]}>
        <YouthSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/official-profile",
    element: (
      <ProtectedRoute allowedRoles={["super_official", "natural_official"]}>
        <OfficialsProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
