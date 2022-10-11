export default {
  'common': {
    required: value => ( (value === 0 || value) && value.toString().length > 0) || '필수 입력 항목입니다..',
    length11: value => value && value.length < 12 || '11자리 이하 숫자로만 입력 가능합니다..',
    digit: value => /^\d+$/.test(value) || '숫자만 입력가능합니다.',
    digitCapAlphabet: value => /^[A-Z0-9_]+$/.test(value) || '숫자, 영문 대문자, _ (underscore) 만 입력가능합니다.',
    notSpace: value => /^\S+$/.test(value) || '공백은 입력할 수 없습니다.',
    // mobile: value => /^0\d{1,2}-\d{3,4}-\d{4}$/.test(value) || '연락처 형식이 아닙니다. ex) 010-1234-5678 041-134-5678',
    mobile: value => !value || /^0\d{9,11}$/.test(value) || '연락처 형식이 아닙니다. ex) 01012345678 0411345678',
    email: value => !value || /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(value) || '이메일 형식이 아닙니다.',
    birth: value => /^(19|20)\d{2}-\d{2}-\d{2}$/.test(value) || !value || '생년월일 형식이 아닙니다. ex) 1998-07-20',
    password: value => /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-8]).{8,200}$/.test(value) || '비밀번호 형식이 아닙니다.',
    alphanumeric: (value, msg) => /^\w+$/.test(value) || msg,
    loginId: value => /^\w+$/.test(value) || /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(value) || '아이디 형식이 아닙니다. 아이디는 영문,숫자 또는 이메일 형식만 입력바랍니다.',
    // loginId: value => !value || /^\w+$/.test(value) || '아이디 형식이 아닙니다. 아이디는 영문,숫자 형식만 입력바랍니다.',
    zipcode: value => !!value && /^\d{5,6}$/.test(value) || '우편번호 형식이 아닙니다.\n\r5~6자리 숫자로 입력해주세요.',
    iso8601: value => (!value || !!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(value)) || '날짜 형식이 아닙니다.',
    qtZero: value => value !== null && value.length !== 0 || '필수 입력 항목입니다.',
  }
}
