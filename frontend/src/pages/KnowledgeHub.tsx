import React, { useState } from 'react';
import { BookOpenIcon, SearchIcon, TagIcon, PlayIcon, FileTextIcon, GlobeIcon, FilterIcon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'guide';
  category: string;
  thumbnail: string;
  duration?: string;
  featured?: boolean;
  link?: string;
}
const KnowledgeHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = [{
    id: 'all',
    name: 'All'
  }, {
    id: 'basics',
    name: 'Basics'
  }, {
    id: 'techniques',
    name: 'Techniques'
  }, {
    id: 'maintenance',
    name: 'Maintenance'
  }, {
    id: 'benefits',
    name: 'Benefits'
  }, {
    id: 'case-studies',
    name: 'Case Studies'
  }];
  const content: ContentItem[] = [{
    id: '1',
    title: 'Introduction to Rainwater Harvesting',
    type: 'article',
    category: 'basics',
    thumbnail: 'https://images.unsplash.com/photo-1525939864518-b53937989bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFpbndhdGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    featured: true,
    link: 'https://savetherivers.in/rainwater-harvesting/'
  }, {
    id: '2',
    title: 'How to Build a Recharge Pit',
    type: 'video',
    category: 'techniques',
    thumbnail: 'https://images.unsplash.com/photo-1594642441838-7d17b2e0e103?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnZ2luZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    duration: '12:45',
    link: 'https://m.youtube.com/watch?v=FAKCczVl5ls'
  }, {
    id: '3',
    title: 'Maintenance Guide for Storage Tanks',
    type: 'guide',
    category: 'maintenance',
    thumbnail: 'https://images.unsplash.com/photo-1607175589090-c188838b9d35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2F0ZXIlMjB0YW5rfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    link: 'https://www.petrosync.com/blog/storage-tank-maintenance/'
  }, {
    id: '4',
    title: 'Economic Benefits of Rainwater Harvesting',
    type: 'article',
    category: 'benefits',
    thumbnail: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    link: 'https://nexteel.in/the-economics-behind-rainwater-harvesting-how-worthwhile-is-the-investment/'
  }, {
    id: '5',
    title: 'Success Story: Community Harvesting Project',
    type: 'article',
    category: 'case-studies',
    thumbnail: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29tbXVuaXR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    link: 'https://neer.co.in/rainwater-harvesting-success-stories-from-around-the-globe/'
  }, {
    id: '6',
    title: 'DIY Filtration Systems',
    type: 'video',
    category: 'techniques',
    thumbnail: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlsdGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    duration: '08:32',
    link: 'https://youtu.be/JPZHTBHOUz4?si=kCeIJtk8YDwfiefu'
  }];
  const filteredContent = activeCategory === 'all' ? content : content.filter(item => item.category === activeCategory);
  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'article':
        return <FileTextIcon className="h-4 w-4" />;
      case 'video':
        return <PlayIcon className="h-4 w-4" />;
      case 'guide':
        return <BookOpenIcon className="h-4 w-4" />;
    }
  };
  return <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Knowledge Hub</h1>
        <p className="text-gray-600">
          Learn about rainwater harvesting techniques and best practices
        </p>
      </div>
      <div className="mb-8">
        <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h2 className="text-xl font-bold mb-2">
                Rainwater Harvesting Essentials
              </h2>
              <p className="opacity-90 mb-4">
                A comprehensive guide for beginners to advanced practitioners
              </p>
              <Button variant="secondary">Start Learning</Button>
            </div>
            <div className="hidden md:block">
              <BookOpenIcon className="h-24 w-24 opacity-20" />
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input type="text" placeholder="Search for articles, videos, guides..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" icon={<FilterIcon size={16} />}>
            Filter
          </Button>
          <select className="border border-gray-300 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
          <Button variant="outline" icon={<GlobeIcon size={16} />}>
            Language
          </Button>
        </div>
      </div>
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map(category => <button key={category.id} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setActiveCategory(category.id)}>
              {category.name}
            </button>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map(item => (
          item.link ? (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
                <div className="relative h-40">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  {item.type === 'video' && <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <PlayIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>}
                  {item.featured && <div className="absolute top-2 right-2 bg-yellow-500 text-xs text-white px-2 py-1 rounded">
                      Featured
                    </div>}
                </div>
                <div className="p-4">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="flex items-center">
                      {getTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </span>
                    {item.duration && <span className="ml-2 flex items-center">
                        • {item.duration}
                      </span>}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <div className="flex items-center">
                    <TagIcon className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500 capitalize">
                      {categories.find(c => c.id === item.category)?.name}
                    </span>
                  </div>
                </div>
              </Card>
            </a>
          ) : (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
              <div className="relative h-40">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                {item.type === 'video' && <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-3">
                      <PlayIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>}
                {item.featured && <div className="absolute top-2 right-2 bg-yellow-500 text-xs text-white px-2 py-1 rounded">
                    Featured
                  </div>}
              </div>
              <div className="p-4">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span className="flex items-center">
                    {getTypeIcon(item.type)}
                    <span className="ml-1 capitalize">{item.type}</span>
                  </span>
                  {item.duration && <span className="ml-2 flex items-center">
                      • {item.duration}
                    </span>}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <div className="flex items-center">
                  <TagIcon className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 capitalize">
                    {categories.find(c => c.id === item.category)?.name}
                  </span>
                </div>
              </div>
            </Card>
          )
        ))}
      </div>
    </MainLayout>;
};
export default KnowledgeHub;