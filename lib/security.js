/**
 * 加密，解密工具类
 */
//key值，要和后端的key相同
var key = CryptoJS.enc.Utf8.parse("abcdef0123456789");
	function Encrypt(word) {
		var srcs = CryptoJS.enc.Utf8.parse(word);
		var encrypted = CryptoJS.AES.encrypt(srcs, key, {
			mode : CryptoJS.mode.ECB,
			padding : CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();
	}
	
	function Decrypt(word) {
		var decrypt = CryptoJS.AES.decrypt(word, key, {
			mode : CryptoJS.mode.ECB,
			padding : CryptoJS.pad.Pkcs7
		});
		return CryptoJS.enc.Utf8.stringify(decrypt).toString();
	}