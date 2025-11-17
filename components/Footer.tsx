import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto border-t border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Kennedy
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              En güncel ifşalar ve içerikler için bizi takip edin.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Sosyal Medya</h4>
            <p className="text-gray-400 text-sm">
              Sosyal medya hesaplarımızı takip edin.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

