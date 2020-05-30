import { IMaterialData, IMaterialTypeDatum, IMaterialBase, IMaterialItem, IMaterialCategoryDatum } from './types';
import { customCategory } from './config';

export function convertMaterialData(materialData: IMaterialData): IMaterialTypeDatum[] {
  const { blocks, scaffolds, components, bases } = materialData;
  const hasBase = bases && bases.length > 0;
  const componentName = hasBase ? '业务组件' : '组件';
  const materialGroup: IMaterialTypeDatum[] = [];

  if (scaffolds) {
    materialGroup.push({
      name: '模板',
      id: 'scaffolds',
      categoryData: getMaterialCategoryData(scaffolds),
    });
  }

  if (blocks) {
    materialGroup.push({
      name: '区块',
      id: 'blocks',
      categoryData: getMaterialCategoryData(blocks),
    });
  }

  if (components) {
    materialGroup.push({
      name: componentName,
      id: 'components',
      categoryData: getMaterialCategoryData(components),
    });
  }

  if (hasBase) {
    materialGroup.push({
      name: '基础组件',
      id: 'bases',
      categoryData: getMaterialCategoryData(bases as IMaterialBase[]),
    });
  }
  return materialGroup;
};

export function getMaterialCategoryData(components: IMaterialItem[]): IMaterialCategoryDatum[] {
  const materialCategoryData: IMaterialCategoryDatum[] = [];
  const otherMaterialCategoryDatum: IMaterialCategoryDatum = {
    name: customCategory,
    list: [],
  };
  components.forEach((component: IMaterialItem) => {
    const { categories } = component;
    if (categories.length) {
      categories.forEach((category: string) => {
        const cateogryDatum = materialCategoryData.find(({ name }) => name === category);
        if (!cateogryDatum) {
          materialCategoryData.push({
            name: category,
            list: [component],
          });
        } else {
          cateogryDatum.list.push(component);
        }
      });
    } else {
      otherMaterialCategoryDatum.list.push(component);
    }
  });
  if (otherMaterialCategoryDatum.list.length) {
    materialCategoryData.unshift(otherMaterialCategoryDatum);
  }
  return materialCategoryData;
}
