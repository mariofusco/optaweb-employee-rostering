/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import DomainObject from 'domain/DomainObject';
import DomainObjectView from 'domain/DomainObjectView';

export function toggleElement<T>(collection: T[], element: T): T[] {
  if (collection.indexOf(element) !== -1) {
    return collection.filter(e => e !== element);
  }
  else {
    return [...collection, element];
  }
}

export function withoutElementWithId<T extends { id?: number }>(collection: T[], removedElementId: number): T[] {
  return collection.filter(element => element.id !== removedElementId);
}

export function withoutElement<T extends { id?: number }>(collection: T[], removedElement: T): T[] {
  return withoutElementWithId(collection, removedElement.id as number);
}

export function withElement<T extends { id?: number }>(collection: T[], addedElement: T): T[] {
  return [...collection, addedElement];
}

export function withUpdatedElement<T extends { id?: number }>(collection: T[], updatedElement: T): T[] {
  return withElement(withoutElement(collection, updatedElement), updatedElement);
}

interface ObjectWithKeys {
  [key: string]: any;
}

export function objectWithout<F>(obj: F, ...without: (keyof F)[]): F {
  const copy: ObjectWithKeys = {
    ...obj
  };
  without.forEach(key => delete copy[key as string]);
  return copy as F;
}

export function mapDomainObjectToView<T extends DomainObject>(obj: T|DomainObjectView<T>): DomainObjectView<T> {
  let result = {} as ObjectWithKeys;
  const objWithKeys = obj as ObjectWithKeys;
  for(const key in obj) {
    if (objWithKeys[key] !== null && objWithKeys[key].id !== undefined) {
      result[key] = objWithKeys[key].id;
    }
    else if (Array.isArray(objWithKeys[key]) && objWithKeys[key].length > 0 && objWithKeys[key][0].id !== undefined) {
      result[key] = objWithKeys[key].map((ele: DomainObject)  => ele.id);
    }
    else {
      result[key] = objWithKeys[key];
    }
  }
  return result as DomainObjectView<T>;
}

export function createIdMapFromList<T extends DomainObject>(collection: T[]): Map<number, DomainObjectView<T>> {
  const map = new Map<number, DomainObjectView<T>>();
  collection.forEach(ele => map.set(ele.id as number, mapDomainObjectToView(ele)));
  return map;
}

export function mapWithoutElement<T extends DomainObject>(map: Map<number, DomainObjectView<T>>,
  removedElement: T|DomainObjectView<T>): Map<number, DomainObjectView<T>> {
  const copy = new Map<number, DomainObjectView<T>>(map);
  copy.delete(removedElement.id as number);
  return copy;
}

export function mapWithElement<T extends DomainObject>(map: Map<number, DomainObjectView<T>>,
  addedElement: T|DomainObjectView<T>): Map<number, DomainObjectView<T>> {
  const copy = new Map<number, DomainObjectView<T>>(map);
  copy.set(addedElement.id as number, mapDomainObjectToView(addedElement));
  return copy;
}

export function mapWithUpdatedElement<T extends DomainObject>(map: Map<number, DomainObjectView<T>>,
  updatedElement: T|DomainObjectView<T>): Map<number, DomainObjectView<T>> {
  return mapWithElement(map, updatedElement);
}

