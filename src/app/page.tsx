"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Home() {

  // State Result
  interface NormalizedArticle {
        title: string;
        description: string;
        url: string;
        image?: string;
        publishedAt: string;
        source: string;
      }
  const [result, setResult] = useState<NormalizedArticle[]>([]);
  
  // State Error
  type Provider = "newsApi" | "gnews" | "mediastack";
  type ErrorState = Record<Provider, string | null>;
  const [errors, setErrors] = useState<ErrorState>({
    newsApi: null,
    gnews: null,
    mediastack: null
  });

  // State Loading
  const [loading, setLoading] = useState<boolean>(false);

  // State extra Query (Search Bar)
  const [inputValue, setInputValue] = useState<string>("");
  const [xquery, setXquery] = useState<string>("");

  // State Load More
  const [page, setPage] = useState(1);

  useEffect(() => {
  async function fetchNews() {
    setLoading(true);

    // Query Param
    const newsApiKey = "93144e16189541ecb5e7ae6770fbc872";
    const gNewsKey = "d18867eb1e4c4b4d5297448c5c929a0d";
    const mediastackKey = "440b3701d18df70d875d48bcd812f736";

    const query = "AI";
    const q = xquery.trim();
    const lang = "en";
    const pageSize = 4;

    // API
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${q ? `${q}+AND+${query}` : `${query}`}&language=${lang}&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${newsApiKey}`;
    const gNewsUrl   = `https://gnews.io/api/v4/search?q=${q ? `${q}+AND+${query}` : `${query}`}&lang=${lang}&sortby=publishedAt&page=${page}&max=${pageSize}&apikey=${gNewsKey}`;
    const mediastackUrl = `https://api.mediastack.com/v1/news?access_key=${mediastackKey}&keywords=${q ? `${q}+AND+${query}` : `${query}`}&language=${lang}&sort=published_desc&limit=${pageSize}&offset=${(page-1)*pageSize}`;

    // Request
    type NewsApiResponse = { articles: NewsApiArticle[] };
    type GNewsResponse = { articles: GNewsArticle[] };
    type MediastackResponse = { data: MediastackArticle[] };

    const results = await Promise.allSettled([
      fetch(newsApiUrl).then(r => r.json()),
      fetch(gNewsUrl).then(r => r.json()),
      fetch(mediastackUrl).then(r => r.json()),
    ]);

    const [newsApiRes, gNewsRes, mediastackRes] = results.map(r =>
      r.status === "fulfilled" ? r.value : null
    ) as [NewsApiResponse | null, GNewsResponse | null, MediastackResponse | null];

    if (!newsApiRes) setErrors(prev => ({ ...prev, newsApi: "Berita dari NewsAPI tidak tersedia." }));
    if (!gNewsRes) setErrors(prev => ({ ...prev, gnews: "Berita dari GNews tidak tersedia." }));
    if (!mediastackRes) setErrors(prev => ({ ...prev, mediastack: "Berita dari Mediastack tidak tersedia." }));

    // Interfaces
    interface NewsApiArticle {
      title: string;
      description: string;
      url: string;
      urlToImage?: string;
      publishedAt: string;
    }
    interface GNewsArticle {
      title: string;
      description: string;
      url: string;
      image?: string;
      publishedAt: string;
    }
    interface MediastackArticle {
      title: string;
      description: string;
      url: string;
      image?: string;
      published_at: string;
    }
    interface NormalizedArticle {
      title: string;
      description: string;
      url: string;
      image?: string;
      publishedAt: string;
      source: string;
    }

    // Normalize
    const normalizedNewsApi: NormalizedArticle[] = (newsApiRes?.articles ?? []).map(
      (article: NewsApiArticle) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.urlToImage,
        publishedAt: article.publishedAt,
        source: "NewsApi",
      })
    );
    const normalizedGNews: NormalizedArticle[] = (gNewsRes?.articles ?? []).map(
      (article: GNewsArticle) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: "GNews",
      })
    );
    const normalizedMediastack: NormalizedArticle[] = (mediastackRes?.data ?? []).map(
      (article: MediastackArticle) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        publishedAt: article.published_at,
        source: "Mediastack",
      })
    );
    const allArticles: NormalizedArticle[] = [
      ...normalizedNewsApi,
      ...normalizedGNews,
      ...normalizedMediastack,
    ];

    console.log(allArticles);

    // Final
    setResult(prev =>
      page === 1 ? allArticles : [...prev, ...allArticles]
    );

    setLoading(false);
  }

  fetchNews();
}, [xquery, page]);



  return (
    <main className="">
      <header className="h-[7vh] sm:h-[8vh] md:h-[9vh] lg:h-[10vh] py-1 sm:py-2 md:py-3 lg:py-4">
          <div className="flex justify-between h-full w-[90%] md:w-[85%] mx-auto">
              <div className="relative w-[15%] h-full">
                <Image
                  src="/urainews.svg"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex w-[40%] justify-end">
                  <Input 
                    type="text" 
                    placeholder="Search.." 
                    value={inputValue ?? ""}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setXquery(inputValue);
                      }
                    }}
                    className="hidden md:block h-full"
                  />
                   <Sheet>
                      <SheetTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="md:hidden">
                              <Search className="h-4 w-4" />
                          </Button>
                      </SheetTrigger>
                      <SheetContent side="top" className="p-4">
                          <SheetHeader className="p-2">
                              <SheetTitle></SheetTitle>
                          </SheetHeader>
                          <Input 
                            type="text" 
                            placeholder="Search.." 
                            value={inputValue ?? ""}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setXquery(inputValue);
                              }
                            }}
                            className="w-full" 
                          />
                      </SheetContent>
                  </Sheet>
              </div>
          </div>
      </header>
      <Separator />
      <section className="py-2 md:py-3 lg:py-4">
        <div className="w-[90%] md:w-[85%] mx-auto">
          {loading && (
            <div className="w-full h-[90vh] flex items-center justify-center">
            <div
              className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
            ></div>
            </div>
          )}
          {result && (
            <>
              <div className="flex flex-col md:flex-row h-[115vh] md:h-[60vh] mb-4 md:mb-6">
                  <Card className="relative h-[45%] md:h-full md:w-[60%] mb-2 md:mr-4 md:mb-0 rounded-md">
                    {result?.length > 0 && result[0].image && (
                      <div
                        className="absolute inset-0 bg-cover bg-center rounded-md"
                        style={{
                          backgroundImage: `url(${
                            result[0].image ? result[0].image : "/img/urainews.jpg"
                          })`,
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-md"/>
                    <div className="relative z-10 p-6 text-white flex flex-col justify-end h-full">
                    <a
                      href={result[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-sm"
                    >
                      <CardTitle className="text-lg md:text-xl font-bold">{result[0].title}</CardTitle>
                      <CardContent className="p-0 mt-4">
                        <p className="text-sm line-clamp-2">{result[0].description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center mt-auto p-0 mt-2">
                        <span className="text-xs text-gray-400">
                          {new Date(result[0].publishedAt).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {result[0].source}
                        </span>
                      </CardFooter>
                    </a>
                    </div>
                  </Card>
                <div className="flex flex-col h-[55%] md:h-full md:w-[40%] gap-2 mb-2 md:mb-4 md:mb-0">
                  {result.slice(1, 4).map((article, i) => (
                    <Card key={i} className="flex-row h-[25%] md:h-[20vh] overflow-hidden">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-sm"
                      >
                        {article.image ? (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="h-full aspect-square object-cover"
                          />
                        ):(
                          <img
                            src="/img/urainews.jpg"
                            alt="Logo"
                            className="h-full aspect-square object-cover"
                          />
                        )}
                      </a>
                      <div className="p-2 flex-1 flex flex-col">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-sm"
                        >
                          <CardTitle className="text-sm font-semibold line-clamp-2">
                            {article.title}
                          </CardTitle>
                          <CardContent className="p-0 mt-2">
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {article.description}
                            </p>
                          </CardContent>
                        </a>
                        <CardFooter className="flex justify-between items-center mt-auto p-0">
                          <span className="text-xs text-gray-400">
                            {new Date(article.publishedAt).toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-400">
                            {article.source}
                          </span>
                        </CardFooter>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {result.slice(4).map((article, idx) => (
                    <Card key={idx + 5} className="overflow-hidden">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-sm"
                      >
                        {article.image && article.image !== "null" ? (
                          <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-48 object-cover" 
                          />
                        ):(
                          <img
                            src="/img/urainews.jpg"
                            alt="Logo"
                            className="w-full h-48 object-cover"
                          />
                        )}
                      </a>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-sm"
                      >
                        <CardHeader>
                          <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="mt-4 mb-2">
                          <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
                        </CardContent>
                      </a>
                      <CardFooter className="flex justify-between items-center mt-auto pb-2 md:pb-4">
                        <span className="text-xs text-gray-400">
                          {new Date(article.publishedAt).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {article.source}
                        </span>
                      </CardFooter>
                    </Card>
                ))}
              </div>
              <Button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading}
                variant="outline"
                className="mt-5"
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
