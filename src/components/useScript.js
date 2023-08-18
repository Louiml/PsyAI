import { useEffect, useState } from 'react';

const useScript = (src) => {
  const [status, setStatus] = useState({ loaded: false, error: false });

  useEffect(() => {
    let script = document.createElement('script');
    script.src = src;
    script.async = true;

    const onScriptLoad = () => {
      setStatus({ loaded: true, error: false });
    };

    const onScriptError = () => {
      script.remove();
      setStatus({ loaded: true, error: true });
    };

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
    };
  }, [src]);

  return status;
};

export default useScript;
