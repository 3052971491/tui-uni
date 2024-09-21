import { generateUUID } from "./common";
import { formatFieldValue } from "./format";

const prefix = "__inner__obj__";

/**
 * ## 格式化选项值
 * @param options
 * @param fieldNames 格式化字段, 支持链式
 * @returns
 */
export function getFormatOptions(
  options: any[] = [],
  fieldNames = { label: "text", value: "value" }
): any[] {
  return options.map((i) => {
    const obj = {
      value: generateUUID(),
      text: formatFieldValue(fieldNames.label, i),
    };
    obj[prefix] = i;
    return obj;
  });
}

/**
 * ## 真正的回显值
 * 数据来源: 格式化选项值
 * @param val 内部使用值
 * @param formatOptions 格式化选项
 * @param fieldNames 格式化字段, 支持链式
 * @param multiple 是否多选, 默认为false
 * @returns
 */
export function getRealValueByFormatOptions(
  val: string | string[],
  formatOptions: any[] = [],
  fieldNames = { label: "text", value: "value" },
  multiple: boolean = false
): string | string[] | undefined {
  if (formatOptions.length <= 0) return multiple ? [] : undefined;
  if (multiple) {
    // 多选
    return formatOptions
      .filter((i) => (val || []).includes(i.value))
      .map((i) => {
        return formatFieldValue(fieldNames.value, i[prefix]);
      });
  }
  const obj = formatOptions.find((i) => i.value === val);
  if (!obj) return undefined;
  return formatFieldValue(fieldNames.value, obj[prefix]);
}

/**
 * ## 内部的使用值
 * 数据来源: 格式化选项值
 * @param val 外部值
 * @param formatOptions 格式化选项
 * @param fieldNames 格式化字段, 支持链式
 * @param multiple 是否多选, 默认为false
 * @returns
 */
export function getInnerValueByFormatOptions(
  val: any | any[],
  formatOptions: any[] = [],
  fieldNames = { label: "text", value: "value" },
  multiple: boolean = false
): string | string[] | undefined {
  if (formatOptions.length <= 0) return multiple ? [] : "";
  if (multiple) {
    // 多选
    return formatOptions
      .filter((i) => (val || []).includes(formatFieldValue(fieldNames.value, i[prefix])))
      .map((i) => {
        return i.value;
      });
  }
  const obj = formatOptions.find(
    (i) => formatFieldValue(fieldNames.value, i[prefix]) === val
  );
  if (!obj) return "";
  return obj.value;
}
