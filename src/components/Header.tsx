// 页面顶部组件：渲染带渐变文字的应用标题和副标语，无交互逻辑
export default function Header() {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
        Elegant QR Code
      </h1>
      <p className="text-gray-500 mt-2">
        把链接和图片，变成一枚好看的二维码
      </p>
    </header>
  )
}
