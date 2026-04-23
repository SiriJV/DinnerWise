import { Breadcrumbs, Anchor, Text, Divider } from '@mantine/core';
import { useLocation, Link } from 'react-router-dom';
import './Breadcrumb.scss';
import { slugify } from '../../utils/slugify';
import { useBreadcrumbData } from './useBreadcrumbData';
import { formatLabel, isHiddenSegment } from './breadcrumbUtils';

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  const { eventName, restaurantName, categoryName, tagName, tagCategoryName } =
    useBreadcrumbData(pathnames);

  if (pathnames[0] === 'profil') return null;

  const items: React.ReactNode[] = [];

  pathnames.forEach((value, index) => {
    const prev = pathnames[index - 1];

    if (isHiddenSegment(value)) return;

    if (prev === 'event' && eventName) {
      items.push(<Text key={`event-${index}`}>{eventName}</Text>);
      return;
    }

    if (prev === 'restaurang' && restaurantName) {
      items.push(<Text key={`rest-${index}`}>{restaurantName}</Text>);
      return;
    }

    if (prev === 'kategori' && categoryName) {
      items.push(<Text key={`cat-${index}`}>{categoryName}</Text>);
      return;
    }

    if (prev === 'tagg' && tagName) {
      if (tagCategoryName) {
        items.push(
          <Anchor
            key={`tag-cat-${index}`}
            component={Link}
            to={`/kategori/${slugify(tagCategoryName)}`}>
            {tagCategoryName}
          </Anchor>,
        );
      }

      items.push(<Text key={`tag-${index}`}>{tagName}</Text>);
      return;
    }

    items.push(<Text key={`seg-${index}`}>{formatLabel(value)}</Text>);
  });

  if (!items.length) return null;

  return (
    <>
      <Breadcrumbs
        className='breadcrumb'
        mt='md'
        ml='md'
        separator='/'
        styles={{
          separator: {
            margin: '0 6px',
          },
        }}>
        <Anchor component={Link} to='/'>
          Startsida
        </Anchor>
        {items}
      </Breadcrumbs>
      <Divider mt='md' />
    </>
  );
}
