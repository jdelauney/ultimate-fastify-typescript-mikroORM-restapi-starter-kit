export const loadEnvironmentVariable = (keyname: string): string | undefined => {
  const envVar = process.env[keyname];
  //console.log(envVar);
  if (!envVar) {
    //throw new Error(`Configuration must include ${keyname}`);
    return undefined;
  }
  return envVar;
};
