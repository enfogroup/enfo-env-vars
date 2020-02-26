export const checkAllMocksCalled = (mocks: any[], times: number) => {
  mocks.forEach((mock: any) => {
    expect(mock).toHaveBeenCalledTimes(times);
  });
};
