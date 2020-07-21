import React, { useEffect } from 'react';

import { getAdmin } from '@/models/api';

export default () => {

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getAdmin();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  return (
    <span>hello </span>
  )
}
