import React, { useEffect } from 'react';
import {
  Link
} from "react-router-dom";

import { getUser } from '@/models/api';

export default () => {

  const name = localStorage.getItem('username');

  useEffect(() => {
    const getData = async () => {
      try {
        const { username } = await getUser();
        localStorage.setItem('username', username);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  return name ? (
    <span>hello  { name }</span>
  ) : (
    <Link to="/login">请先登录</Link>
  )
}
