import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from '@components/NavbarFeed';

import { NewsFeed } from './newsFeed';
import { Announcement } from './announcements.jsx';
import { Activities } from './activities.jsx';

const NewsFeedLayout = () => {
  return (
    <main>
      <Navbar />
      <section className="pageContent">
        <Outlet />
      </section>
    </main>
  );
};

export default function NewsFeedRoutes() {
  return (
    <Routes>
      <Route element={<NewsFeedLayout />}>
        <Route index element={<NewsFeed />} />
        <Route path="announcements" element={<Announcement />} />
        <Route path="activities" element={<Activities />} />
      </Route>
    </Routes>
  );
}
