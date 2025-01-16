/** 
 * 格式化字段
 * @param key 字段名
 * @param value 目标对象
 * @description 支持链式解析，如：xxx.xx.x
 * @returns 解析后的字段值
 */
export function formatFieldValue(key: string, value: any): any {
  let result = value;
  try {
    const field: Array<string> = key.split(".");
    field.map((item) => {
      result = result[item];
    });
    return result;
  } catch (error) {
    return null;
  }
}
