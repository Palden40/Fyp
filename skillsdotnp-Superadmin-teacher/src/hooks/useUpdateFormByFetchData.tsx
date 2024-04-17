import { useEffect } from 'react';

export const useUpdateFormByFetchData = (data, reset) => {
  useEffect(() => {
    reset(data);
  }, [data]);
};
