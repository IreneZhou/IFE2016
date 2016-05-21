## 总结

#### 三栏式布局，两边侧栏固定宽度，中间栏固定宽度。

-   **在HTML中，要把中间栏放在左右侧栏之后。**
-   设定好侧栏的宽度，分别向左和向右float。
-   给中间栏设定向左向右的margin（即侧栏的宽度+margin+padding)。
-   给最外边的container的overflow设置为auto，这样float的元素就不会超过容器的长度了。



另：

```css
* {
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}
```

元素的宽度不会因为padding而改变了。