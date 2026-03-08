// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight} from 'lucide-react';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Nabvar';
import ValuesSection from '@/components/ValuesSection';


export default async function HomePage() {
  
  await connectDB();
  const products = await Product.find({ inStock: true })
    .limit(4)
    .lean();

  return (
    <div>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 items-center">
              <div className="order-2 lg:order-1">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-gray-900 leading-tight">
                  En emotionell livsstilsbutik för barns inre värld 
                </h1>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                  För stora känslor i små hjärtan 
                  En lekfull värld kring våra figurer där berättelser, pedagogiska material och barnrumsdetaljer 
                  tillsammans skapar trygghet och stödjer barns utveckling genom lek, läsning och samtal.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link 
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 bg-purple-600 text-white hover:bg-purple-700 h-12 rounded-lg px-8 text-base"
                  >
                    Produkter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link 
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 h-12 rounded-lg px-8 text-base"
                  >
                    Om oss
                  </Link>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative aspect-4/5 lg:aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src="/duddaloosHome.svg"
                    alt="home bildillustration"
                    fill
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
   <section className="py-24 lg:py-32 bg-[#F8F6F2]">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900">
            Utvalda produkter
          </h2>
          <p className="mt-3 text-gray-600">
            Noga utformade för de små
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium hover:bg-gray-100 hover:text-gray-900 h-11 px-6 py-2 self-start sm:self-auto"
        >
          Visa alla
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-600">Inga produkter tillgängliga.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id.toString()}
                product={{
                  ...product,
                  _id: product._id.toString(),
                  createdAt: product.createdAt?.toString(),
                  updatedAt: product.updatedAt?.toString(),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>


        {/* Values Section */}
        <ValuesSection />

       {/* Nyhetsbrevssektion
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900">
              Gå med i vår familj
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Prenumerera för att få uppdateringar om nya produkter, föräldratips
              och exklusiva erbjudanden för vår community.
            </p>
            <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                className="flex w-full border border-gray-300 bg-white py-2 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 px-5 rounded-xl"
                placeholder="Ange din e-postadress"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap font-medium bg-purple-600 text-white hover:bg-purple-700 h-12 rounded-lg px-8 text-base shrink-0"
              >
                Prenumerera
              </button>
            </form>
            <p className="mt-4 text-xs text-gray-500">
              Vi respekterar din integritet. Avsluta prenumerationen när som helst.
            </p>
          </div>
        </div>
      </section> */}

      </main>
    </div>
  );
}