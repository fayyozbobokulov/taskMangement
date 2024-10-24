/* eslint-disable no-undef */
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
