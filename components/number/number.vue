<template>
    <view class="uni-numbox">
        <input ref="inputInstance" :class="{ 'uni-numbox--disabled': disabled }" :focus="focused" :disabled="disabled" @focus="_onFocus" @blur="_onBlur" class="uni-numbox__value" type="number"
            v-model="inputValue" :style="{background, color}" :placeholder="placeholder" />
    </view>
</template>
<script>
    export default {
        name: "Number",
        emits: ['change', 'input', 'update:modelValue', 'blur', 'focus'],
        props: {
            modelValue: {
                type: [Number, String],
                default: 0
            },
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 99999999
            },
            step: {
                type: Number,
                default: 1
            },
            background: {
                type: String,
                default: '#F7F8FA'
            },
            color: {
                type: String,
                default: '#333'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                inputValue: this._formatValue(this.modelValue),
                focused: false,
            };
        },
        watch: {
            modelValue(val) {
                // 当外部值变化时更新内部值
                this.inputValue = this._formatValue(val);
            }
        },
        created() {
            // 初始化时使用modelValue
            this.inputValue = this._formatValue(this.modelValue);
        },
        methods: {
            focus() {
                this.focused = true;
                // this.$refs.inputInstance.focus();
            },
            blur() {
                this.focused = false;
                // this.$refs.inputInstance.blur();
            },
            _calcValue(type) {
                if (this.disabled) {
                    return;
                }
                const scale = this._getDecimalScale();
                let value = parseFloat(this.inputValue) * scale;
                let step = this.step * scale;
                
                if (type === "minus") {
                    value -= step;
                    if (value < (this.min * scale)) {
                        return;
                    }
                }

                if (type === "plus") {
                    value += step;
                    if (value > (this.max * scale)) {
                        return;
                    }
                }

                this.inputValue = (value / scale).toFixed(String(scale).length - 1);
                this._emitValueChanged();
            },
            _getDecimalScale() {
                let scale = 1;
                // 浮点型
                if (~~this.step !== this.step) {
                    scale = Math.pow(10, String(this.step).split(".")[1].length);
                }
                return scale;
            },
            _onBlur(event) {
                this.$emit('blur', event)
                let value = event.detail.value;
                
                if (value === '' || isNaN(value)) {
                    this.inputValue = this.min.toString();
                } else {
                    value = parseFloat(value);
                    if (value > this.max) {
                        value = this.max;
                    } else if (value < this.min) {
                        value = this.min;
                    }
                    const scale = this._getDecimalScale();
                    this.inputValue = value.toFixed(String(scale).length - 1);
                }
                
                this.blur();
                this._emitValueChanged();
            },
            _onFocus(event) {
                this.focus();
                this.$emit('focus', event)
            },
            _formatValue(value) {
                // 格式化值为字符串，确保是有效的数字格式
                if (value === '' || value === null || value === undefined) {
                    return this.min.toString();
                }
                
                const num = parseFloat(value);
                
                if (isNaN(num)) {
                    return this.min.toString();
                }
                
                // 确保值在 min 和 max 范围内
                const validValue = Math.min(Math.max(num, this.min), this.max);
                const scale = this._getDecimalScale();
                
                return validValue.toFixed(String(scale).length - 1);
            },
            _emitValueChanged() {
                // 统一触发值变更事件
                const numericValue = parseFloat(this.inputValue);
                this.$emit("change", numericValue);
                this.$emit("input", numericValue);
                this.$emit("update:modelValue", numericValue);
            }
        }
    };
</script>
<style lang="scss" scoped>
	$box-height: 36px;
	$bg: #f7f8fa;
	$br: 2px;
	$color: #333;

	.uni-numbox {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-numbox-btns {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0 8px;
		background-color: $bg;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-numbox__value {
		margin: 0 2px;
		background-color: $bg;
		width: 100%;
        padding: 0 6px;
		height: $box-height;
		text-align: left;
		font-size: 14px;
		border-left-width: 0;
		border-right-width: 0;
		color: $color;
	}

	.uni-numbox__minus {
		border-top-left-radius: $br;
		border-bottom-left-radius: $br;
	}

	.uni-numbox__plus {
		border-top-right-radius: $br;
		border-bottom-right-radius: $br;
	}

	.uni-numbox--text {
		// fix nvue
		line-height: 20px;

		font-size: 20px;
		font-weight: 300;
		color: $color;
	}

	.uni-numbox .uni-numbox--disabled {
		color: rgb(201, 205, 212) !important;
        background-color: #f2f3f5 !important;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
		.uni-input-placeholder {
    		color: rgb(201, 205, 212);

    	}
	}

	.uni-input-placeholder {
		color: rgb(29, 33, 41);
    	font-size: 14px;
    	opacity: 0.3;
    }
</style>
