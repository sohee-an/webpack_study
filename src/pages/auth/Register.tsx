import React from 'react';

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">회원가입</h1>

        {/* 아이디 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
          <input
            type="email"
            placeholder="아이디를 입력해주세요"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 다시 한번 입력해주세요"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Register;
