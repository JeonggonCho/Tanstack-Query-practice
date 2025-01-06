// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/vitest";

// https://www.npmjs.com/package/@testing-library/jest-dom#with-another-jest-compatible-expect
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

// for msw
import { server } from "./mocks/server.js";

// add jest-dom matchers
expect.extend(matchers);

// mock useLoginData to mimic a logged-in user
// 로그인한 유저를 모사하기 위한 useLoginData 목업
// vi.mock은 jest.mock과 매우 유사함
// 현재 기본적으로 auth 컨텍스트에 대해서 useLoginData 반환 시,
// 항상 사용자 id가 1인 객체를 반환하는 함수를 제공하라고 설정
// 그 후 기본 값 제공 -> 기본 값은 제공자로서 기본적으로 제공자에게 전달된 자식들을 반환함
vi.mock("./auth/AuthContext", () => ({
    __esModule: true,
    // for the hook return value
    useLoginData: () => ({ userId: 1 }),
    // for the provider default export
    default: ({ children }) => children,
}));

// msw setup and teardown below
// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
