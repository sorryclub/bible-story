import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Star,
  Users,
  ChevronRight,
  Info,
} from "lucide-react";
import { getBook, getAllBooks, categories, getAllCharacters, getBookChapters } from "@/lib/db";
import CharacterAvatar from "@/components/CharacterAvatar";
import AnimatedSection from "./AnimatedSection";
import { Suspense } from "react";
import ChapterList from "./ChapterList";
import StickyBookTitle from "./StickyBookTitle";

export default async function BookDetailPage({ params }) {
  const { id } = await params;
  const [book, allBooks, allCharacters, chapters] = await Promise.all([
    getBook(id),
    getAllBooks(),
    getAllCharacters(),
    getBookChapters(id),
  ]);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-stone-700 mb-2">
            책을 찾을 수 없습니다
          </h1>
          <p className="text-base text-stone-400 mb-6">
            요청하신 페이지가 존재하지 않습니다.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-base text-stone-500 hover:text-stone-800 transition-colors"
          >
            <ArrowLeft size={14} />
            성경 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const relatedCharacters = allCharacters.filter((c) =>
    c.books.includes(book.id)
  );

  const currentIndex = allBooks.findIndex((b) => b.id === book.id);
  const prevBook = currentIndex > 0 ? allBooks[currentIndex - 1] : null;
  const nextBook =
    currentIndex < allBooks.length - 1 ? allBooks[currentIndex + 1] : null;

  const catInfo = categories[book.category];

  return (
    <div className="min-h-screen">
      {/* 스크롤 시 제목이 사라지면 상단에 현재 책 이름 고정 표시 */}
      <StickyBookTitle
        name={book.name}
        nameEn={book.nameEn}
        color={catInfo?.color || book.color}
        category={book.category}
      />

      {/* Hero */}
      <section className="py-14 pb-10 border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-base text-stone-400 hover:text-stone-700 transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            성경 목록
          </Link>

          <AnimatedSection duration={0.5}>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-base px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: `${catInfo?.color || book.color}14`,
                  color: catInfo?.color || book.color,
                }}
              >
                {book.category}
              </span>
              <span
                className="text-base px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: `${book.color}14`,
                  color: book.color,
                }}
              >
                {book.chapters}장
              </span>
            </div>

            {/* Title */}
            <h1
              id="book-hero-title"
              className="text-3xl font-bold text-stone-900 mb-1 tracking-tight"
            >
              {book.name}
            </h1>
            <p className="text-base text-stone-400 mb-5">{book.nameEn}</p>

            {/* Summary */}
            <p className="text-base text-stone-600 leading-relaxed max-w-2xl mb-4">
              {book.summary}
            </p>

            {/* Key theme tag */}
            <span
              className="inline-flex items-center gap-1.5 text-base px-3 py-1.5 rounded-full font-medium"
              style={{
                backgroundColor: `${book.color}10`,
                color: book.color,
              }}
            >
              <Star size={12} />
              {book.keyTheme}
            </span>

            {/* Unique Perspective (복음서 등) */}
            {book.uniquePerspective && (
              <div className="mt-6 p-5 bg-stone-50 rounded-xl border border-stone-100">
                <p className="text-base font-medium text-stone-400 mb-2 uppercase tracking-wider">
                  이 책의 특징
                </p>
                <p className="text-base text-stone-700 leading-relaxed">
                  {book.uniquePerspective}
                </p>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Main (2/3) */}
          <div className="md:col-span-2 space-y-10">
            {/* Highlights */}
            <AnimatedSection delay={0.15} duration={0.5}>
              <h2 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
                <BookOpen size={18} className="text-stone-400" />
                주요 내용
              </h2>

              {book.highlights && book.highlights.length > 0 ? (
                <div className="space-y-3">
                  {book.highlights.map((highlight, i) => (
                    <AnimatedSection
                      key={i}
                      delay={0.2 + i * 0.04}
                      duration={0.4}
                      className="flex gap-4 p-4 rounded-lg bg-white border border-stone-100"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <span
                          className="text-base font-bold shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: book.color }}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-base text-stone-400">
                              {highlight.chapter}장
                            </span>
                            <h4 className="font-semibold text-stone-800 text-base">
                              {highlight.title}
                            </h4>
                          </div>
                          <p className="text-base text-stone-500 leading-relaxed">
                            {highlight.desc}
                          </p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              ) : (
                <p className="text-base text-stone-400">
                  하이라이트 정보가 아직 준비되지 않았습니다.
                </p>
              )}
            </AnimatedSection>

            {/* Chapter Summaries */}
            <AnimatedSection delay={0.3} duration={0.5}>
              <h2 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
                <Star size={18} className="text-stone-400" />
                각 장 요약 ({book.chapters}장)
              </h2>
              {chapters && chapters.length > 0 ? (
                <Suspense fallback={<div className="text-stone-400">로딩 중...</div>}>
                  <ChapterList chapters={chapters} bookColor={book.color} characters={allCharacters} />
                </Suspense>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
                  {Array.from({ length: book.chapters }, (_, i) => i + 1).map(
                    (chapter) => (
                      <div
                        key={chapter}
                        className="w-full aspect-square rounded flex items-center justify-center text-base font-medium bg-stone-100 text-stone-600 cursor-default"
                      >
                        {chapter}
                      </div>
                    )
                  )}
                </div>
              )}
            </AnimatedSection>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Info Card */}
            <AnimatedSection delay={0.2} duration={0.5} className="bg-white rounded-xl p-5 border border-stone-100">
              <h3 className="text-base font-semibold text-stone-700 mb-4 flex items-center gap-1.5">
                <Info size={14} className="text-stone-400" />
                기본 정보
              </h3>
              <div className="space-y-3 text-base">
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">분류</span>
                  <span className="font-medium text-stone-700 flex items-center gap-1.5">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: catInfo?.color || book.color }}
                    />
                    {book.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">챕터 수</span>
                  <span className="font-medium text-stone-700">
                    {book.chapters}장
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">핵심 주제</span>
                  <span className="font-medium text-stone-700">
                    {book.keyTheme}
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* 등장 인물은 각 장 요약에 표시되므로 사이드바에서 제거 */}

            {/* Prev/Next Navigation */}
            <AnimatedSection delay={0.4} duration={0.5} className="bg-white rounded-xl p-5 border border-stone-100">
              <h3 className="text-base font-semibold text-stone-700 mb-4 flex items-center gap-1.5">
                <BookOpen size={14} className="text-stone-400" />
                다른 책 보기
              </h3>
              <div className="space-y-2">
                {prevBook && (
                  <Link
                    href={`/books/${prevBook.id}`}
                    className="flex items-center gap-2 p-2 -mx-2 rounded-lg hover:bg-stone-50 transition-colors text-base group"
                  >
                    <ArrowLeft
                      size={14}
                      className="text-stone-300 group-hover:text-stone-500 transition-colors shrink-0"
                    />
                    <span className="text-stone-600">{prevBook.name}</span>
                    <span className="text-base text-stone-300 ml-auto">
                      {prevBook.nameEn}
                    </span>
                  </Link>
                )}
                {nextBook && (
                  <Link
                    href={`/books/${nextBook.id}`}
                    className="flex items-center gap-2 p-2 -mx-2 rounded-lg hover:bg-stone-50 transition-colors text-base group"
                  >
                    <ChevronRight
                      size={14}
                      className="text-stone-300 group-hover:text-stone-500 transition-colors shrink-0"
                    />
                    <span className="text-stone-600">{nextBook.name}</span>
                    <span className="text-base text-stone-300 ml-auto">
                      {nextBook.nameEn}
                    </span>
                  </Link>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
