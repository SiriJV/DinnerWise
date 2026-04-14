import { Breadcrumbs, Anchor, Text } from '@mantine/core';
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

  const items = pathnames
    .map((value, index) => {
      const prev = pathnames[index - 1];

      if (prev === 'event' && eventName) {
        return <Text key={index}>{eventName}</Text>;
      }

      if (prev === 'restaurang' && restaurantName) {
        return <Text key={index}>{restaurantName}</Text>;
      }

      if (prev === 'kategori' && categoryName) {
        return <Text key={index}>{categoryName}</Text>;
      }

      if (prev === 'tagg' && tagName) {
        return (
          <>
            {tagCategoryName && (
              <Anchor
                key={`cat-${index}`}
                component={Link}
                to={`/kategori/${slugify(tagCategoryName)}`}>
                {tagCategoryName}
              </Anchor>
            )}
            <Text key={`tag-${index}`}>{tagName}</Text>
          </>
        );
      }

      if (isHiddenSegment(value)) return null;

      return <Text key={index}>{formatLabel(value)}</Text>;
    })
    .flat()
    .filter(Boolean);

  if (!items.length) return null;

  return (
    <Breadcrumbs className='breadcrumb' mt='md' ml='md'>
      <Anchor component={Link} to='/'>
        Startsida
      </Anchor>
      {items}
    </Breadcrumbs>
  );
}
