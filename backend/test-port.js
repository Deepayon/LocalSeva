console.log('PORT from process.env:', process.env.PORT);
console.log('Default PORT:', 3002);
const PORT = process.env.PORT || 3002;
console.log('Final PORT:', PORT);