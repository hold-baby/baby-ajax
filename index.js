import Ajax from './src/Ajax.js'

// 检验是否浏览器环境
try {
    document 
} catch (ex) {
    throw new Error('请在浏览器环境下运行')
} 

export default new Ajax()