import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import CodeRunner from '../components/CodeRunner'

// Import the same problems data
const PROBLEMS = [
  { id: 1, title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', acceptance: 49.2, likes: 1240, companies: ['Google', 'Amazon', 'Meta'], tags: ['Hash Map', 'Two Pointer'], desc: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9' }], constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists.'], hint: 'Use a hash map to store the complement of each number as you iterate.' },
  { id: 2, title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', acceptance: 54.1, likes: 980, companies: ['Amazon', 'Microsoft'], tags: ['Sliding Window', 'Greedy'], desc: 'You are given an array prices where prices[i] is the price of a given stock on the iᵗʰ day. Maximize profit by choosing a single day to buy and sell.', examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5.' }], constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'], hint: 'Track the minimum price seen so far and the maximum profit at each step.' },
  { id: 3, title: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', acceptance: 50.3, likes: 1580, companies: ['Google', 'Apple', 'Amazon'], tags: ["Kadane's Algorithm", 'DP'], desc: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.', examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' }], constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'], hint: "Use Kadane's algorithm: keep a running sum and reset when it goes negative." },
  { id: 4, title: 'Product of Array Except Self', topic: 'Arrays', difficulty: 'Medium', acceptance: 65.0, likes: 1120, companies: ['Meta', 'Amazon', 'Microsoft'], tags: ['Prefix Sum'], desc: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i], without using division.', examples: [{ input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' }], constraints: ['2 ≤ nums.length ≤ 10⁵', '-30 ≤ nums[i] ≤ 30'], hint: 'Use prefix and suffix products in two passes.' },
  { id: 5, title: 'Trapping Rain Water', topic: 'Arrays', difficulty: 'Hard', acceptance: 59.3, likes: 2100, companies: ['Google', 'Amazon', 'Goldman Sachs'], tags: ['Two Pointer', 'Stack', 'DP'], desc: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }], constraints: ['n == height.length', '1 ≤ n ≤ 2 × 10⁴', '0 ≤ height[i] ≤ 10⁵'], hint: 'Use two pointers from both ends, tracking leftMax and rightMax.' },
  { id: 6, title: 'Valid Anagram', topic: 'Strings', difficulty: 'Easy', acceptance: 62.8, likes: 850, companies: ['Google', 'Microsoft'], tags: ['Hash Map', 'Sorting'], desc: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.', examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true' }], constraints: ['1 ≤ s.length, t.length ≤ 5 × 10⁴', 's and t consist of lowercase English letters.'], hint: 'Count character frequencies using a hash map.' },
  { id: 7, title: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'Medium', acceptance: 33.8, likes: 2340, companies: ['Amazon', 'Google', 'Bloomberg'], tags: ['Sliding Window', 'Hash Set'], desc: 'Given a string s, find the length of the longest substring without repeating characters.', examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' }], constraints: ['0 ≤ s.length ≤ 5 × 10⁴', 's consists of English letters, digits, symbols and spaces.'], hint: 'Use a sliding window with a set to track unique characters.' },
  { id: 8, title: 'Reverse Linked List', topic: 'Linked Lists', difficulty: 'Easy', acceptance: 73.4, likes: 1670, companies: ['Google', 'Apple'], tags: ['Iterative', 'Recursive'], desc: 'Given the head of a singly linked list, reverse the list, and return the reversed list.', examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }], constraints: ['The number of nodes is [0, 5000]', '-5000 ≤ Node.val ≤ 5000'], hint: 'Use three pointers: prev, current, and next.' },
  { id: 9, title: 'Merge Two Sorted Lists', topic: 'Linked Lists', difficulty: 'Easy', acceptance: 62.5, likes: 1430, companies: ['Amazon', 'Microsoft'], tags: ['Recursion', 'Linked List'], desc: 'Merge two sorted linked lists and return it as a sorted list.', examples: [{ input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' }], constraints: ['Both lists are sorted in non-decreasing order.'], hint: 'Compare heads of both lists and build the result iteratively.' },
  { id: 10, title: 'Linked List Cycle', topic: 'Linked Lists', difficulty: 'Easy', acceptance: 47.5, likes: 890, companies: ['Amazon', 'Apple'], tags: ["Floyd's Algorithm", 'Two Pointer'], desc: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.', examples: [{ input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'There is a cycle connecting tail to the second node.' }], constraints: ['The number of nodes is [0, 10⁴]'], hint: "Use Floyd's tortoise and hare algorithm with slow and fast pointers." },
  { id: 11, title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', acceptance: 73.8, likes: 1280, companies: ['Google', 'Meta'], tags: ['DFS', 'BFS', 'Recursion'], desc: "Given the root of a binary tree, return its maximum depth.", examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3' }], constraints: ['The number of nodes is [0, 10⁴]'], hint: 'Recursively compute 1 + max(leftDepth, rightDepth).' },
  { id: 12, title: 'Lowest Common Ancestor of BST', topic: 'Trees', difficulty: 'Medium', acceptance: 60.2, likes: 1050, companies: ['Meta', 'Microsoft', 'Amazon'], tags: ['BST', 'Recursion'], desc: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes.', examples: [{ input: 'root = [6,2,8,0,4,7,9], p = 2, q = 8', output: '6' }], constraints: ['p and q will exist in the BST.', 'All values are unique.'], hint: 'If both nodes are smaller, go left. If both are larger, go right. Otherwise, current node is LCA.' },
  { id: 13, title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', acceptance: 56.4, likes: 2100, companies: ['Amazon', 'Google', 'Meta'], tags: ['BFS', 'DFS', 'Union Find'], desc: 'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.', examples: [{ input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2' }], constraints: ['m == grid.length', 'n == grid[i].length', '1 ≤ m, n ≤ 300'], hint: 'Use DFS/BFS to explore and mark connected land cells.' },
  { id: 14, title: "Course Schedule", topic: 'Graphs', difficulty: 'Medium', acceptance: 45.6, likes: 1780, companies: ['Google', 'Amazon', 'Apple'], tags: ['Topological Sort', 'BFS'], desc: 'There are a total of numCourses courses you have to take. Some courses have prerequisites. Return whether it is possible to finish all courses.', examples: [{ input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' }], constraints: ['1 ≤ numCourses ≤ 2000'], hint: 'Use topological sort to detect cycles in the dependency graph.' },
  { id: 15, title: 'Climbing Stairs', topic: 'DP', difficulty: 'Easy', acceptance: 51.8, likes: 1540, companies: ['Amazon', 'Google'], tags: ['Dynamic Programming', 'Fibonacci'], desc: 'You are climbing a staircase. It takes n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?', examples: [{ input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' }], constraints: ['1 ≤ n ≤ 45'], hint: "It's the Fibonacci sequence! dp[n] = dp[n-1] + dp[n-2]." },
  { id: 16, title: 'Longest Common Subsequence', topic: 'DP', difficulty: 'Medium', acceptance: 58.9, likes: 1320, companies: ['Google', 'Amazon', 'Microsoft'], tags: ['DP', '2D Table'], desc: 'Given two strings text1 and text2, return the length of their longest common subsequence.', examples: [{ input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: 'The longest common subsequence is "ace".' }], constraints: ['1 ≤ text1.length, text2.length ≤ 1000'], hint: 'Build a 2D DP table where dp[i][j] represents the LCS of text1[0..i-1] and text2[0..j-1].' },
  { id: 17, title: '0/1 Knapsack Problem', topic: 'DP', difficulty: 'Hard', acceptance: 42.1, likes: 1680, companies: ['Google', 'Goldman Sachs'], tags: ['DP', 'Optimization'], desc: 'Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value.', examples: [{ input: 'W = 50, wt = [10,20,30], val = [60,100,120]', output: '220', explanation: 'Take items with weight 20 and 30.' }], constraints: ['1 ≤ n ≤ 1000', '1 ≤ W ≤ 1000'], hint: 'For each item, decide to include or exclude it. Use dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w-wt[i]]).' },
  { id: 18, title: 'Merge Intervals', topic: 'Sorting', difficulty: 'Medium', acceptance: 46.2, likes: 1890, companies: ['Google', 'Meta', 'Bloomberg'], tags: ['Sorting', 'Intervals'], desc: 'Given an array of intervals, merge all overlapping intervals.', examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }], constraints: ['1 ≤ intervals.length ≤ 10⁴'], hint: 'Sort by start time, then merge consecutive overlapping intervals.' },
  { id: 19, title: 'Valid Parentheses', topic: 'Stack/Queue', difficulty: 'Easy', acceptance: 40.5, likes: 2200, companies: ['Amazon', 'Google', 'Meta'], tags: ['Stack'], desc: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", examples: [{ input: 's = "()[]{}"', output: 'true' }], constraints: ['1 ≤ s.length ≤ 10⁴'], hint: 'Use a stack. Push opening brackets, pop and compare for closing brackets.' },
  { id: 20, title: 'Min Stack', topic: 'Stack/Queue', difficulty: 'Medium', acceptance: 52.3, likes: 1350, companies: ['Amazon', 'Microsoft'], tags: ['Stack', 'Design'], desc: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.', examples: [{ input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()', output: '-3, 0, -2' }], constraints: ['Methods pop, top and getMin will always be called on non-empty stacks.'], hint: 'Maintain a second stack that tracks the minimum at each level.' },
  { id: 21, title: 'Reverse Integer', topic: 'Math', difficulty: 'Medium', acceptance: 27.6, likes: 1050, companies: ['Amazon', 'Apple'], tags: ['Math'], desc: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing causes overflow, return 0.', examples: [{ input: 'x = 123', output: '321' }, { input: 'x = -123', output: '-321' }], constraints: ['-2³¹ ≤ x ≤ 2³¹ - 1'], hint: 'Use modulo and division to extract digits. Check for overflow before each step.' },
  { id: 22, title: 'Power of Two', topic: 'Math', difficulty: 'Easy', acceptance: 46.3, likes: 620, companies: ['Google'], tags: ['Bit Manipulation'], desc: 'Given an integer n, return true if it is a power of two. Otherwise, return false.', examples: [{ input: 'n = 16', output: 'true' }], constraints: ['-2³¹ ≤ n ≤ 2³¹ - 1'], hint: 'A power of two in binary has exactly one 1 bit. Use n & (n-1) == 0.' },
]

const diffColor = { Easy: 'text-emerald-500', Medium: 'text-amber-500', Hard: 'text-red-500' }
const diffBg = { Easy: 'bg-emerald-500/10 border-emerald-500/20', Medium: 'bg-amber-500/10 border-amber-500/20', Hard: 'bg-red-500/10 border-red-500/20' }

export default function ProblemSolverPage() {
  const { id } = useParams()
  const problem = PROBLEMS.find(p => p.id === parseInt(id))
  const [activeDescTab, setActiveDescTab] = useState('description')
  const [timer, setTimer] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)
  const [splitPosition, setSplitPosition] = useState(45) // percentage
  const [isDragging, setIsDragging] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Timer
  useEffect(() => {
    if (!timerRunning) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [timerRunning])

  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Drag for split pane
  const handleMouseDown = () => setIsDragging(true)
  useEffect(() => {
    if (!isDragging) return
    const handleMouseMove = (e) => {
      const pct = (e.clientX / window.innerWidth) * 100
      setSplitPosition(Math.max(25, Math.min(75, pct)))
    }
    const handleMouseUp = () => setIsDragging(false)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Navigate to next/prev problem
  const currentIndex = PROBLEMS.findIndex(p => p.id === parseInt(id))
  const prevProblem = currentIndex > 0 ? PROBLEMS[currentIndex - 1] : null
  const nextProblem = currentIndex < PROBLEMS.length - 1 ? PROBLEMS[currentIndex + 1] : null

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-slate-600 block mb-4">search_off</span>
          <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
          <p className="text-slate-400 mb-6">The problem you're looking for doesn't exist.</p>
          <Link to="/practice" className="rounded-full bg-[#2f8e47] text-white font-bold px-6 py-3 hover:bg-[#267a3c] transition-colors">
            ← Back to Practice
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-white overflow-hidden" style={{ userSelect: isDragging ? 'none' : 'auto' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/practice" className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Problems
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-2">
            {prevProblem && (
              <Link to={`/practice/${prevProblem.id}`} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </Link>
            )}
            <span className="text-sm font-bold text-white">
              <span className="text-slate-500 font-mono">#{problem.id}</span> {problem.title}
            </span>
            {nextProblem && (
              <Link to={`/practice/${nextProblem.id}`} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </Link>
            )}
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${diffBg[problem.difficulty]} ${diffColor[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-[#0d1117] rounded-lg px-3 py-1.5 border border-slate-700/50">
            <span className="material-symbols-outlined text-sm text-[#2f8e47]">timer</span>
            <span className="text-sm font-mono text-slate-300">{formatTime(timer)}</span>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">{timerRunning ? 'pause' : 'play_arrow'}</span>
            </button>
            <button
              onClick={() => { setTimer(0); setTimerRunning(true) }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
            </button>
          </div>

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-slate-500 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-xl">{isBookmarked ? 'bookmark' : 'bookmark_border'}</span>
          </button>
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div
          className="flex-shrink-0 overflow-y-auto border-r border-slate-700/50"
          style={{ width: `${splitPosition}%` }}
        >
          {/* Tab Headers */}
          <div className="sticky top-0 z-10 flex items-center gap-1 px-4 py-2 bg-[#161b22] border-b border-slate-700/50">
            {[
              { id: 'description', icon: 'description', label: 'Description' },
              { id: 'hints', icon: 'lightbulb', label: 'Hints' },
              { id: 'solutions', icon: 'code', label: 'Editorial' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDescTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDescTab === tab.id
                    ? 'bg-[#2f8e47]/20 text-[#2f8e47]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeDescTab === 'description' && (
              <div className="flex flex-col gap-6">
                {/* Title & Meta */}
                <div>
                  <h1 className="text-2xl font-bold text-white mb-3">{problem.title}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${diffBg[problem.difficulty]} ${diffColor[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">{problem.topic}</span>
                    {problem.tags.map(t => (
                      <span key={t} className="text-[10px] font-medium text-[#2f8e47] bg-[#2f8e47]/10 px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-yellow-500">thumb_up</span>
                      {problem.likes}
                    </span>
                    <span>Acceptance: {problem.acceptance}%</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-slate-300 leading-relaxed">{problem.desc}</p>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-3">Examples</h3>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="bg-[#161b22] rounded-xl p-4 mb-3 border border-slate-700/50">
                      <p className="text-xs font-bold text-slate-300 mb-2">Example {i + 1}:</p>
                      <div className="font-mono text-xs space-y-1">
                        <p><span className="text-[#a3e6b7] font-bold">Input: </span><span className="text-slate-300">{ex.input}</span></p>
                        <p><span className="text-[#a3e6b7] font-bold">Output: </span><span className="text-slate-300">{ex.output}</span></p>
                        {ex.explanation && <p className="text-slate-500 italic mt-2">💡 {ex.explanation}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-3">Constraints</h3>
                  <ul className="text-xs text-slate-400 space-y-1.5">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#2f8e47] mt-0.5 flex-shrink-0">•</span>
                        <code className="bg-[#161b22] px-2 py-0.5 rounded text-slate-300 border border-slate-700/30">{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Tags */}
                <div className="pt-4 border-t border-slate-700/30">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Frequently Asked At</p>
                  <div className="flex gap-2 flex-wrap">
                    {problem.companies.map(c => (
                      <span key={c} className="text-xs font-bold bg-[#161b22] text-slate-300 px-3 py-1.5 rounded-full border border-slate-700/30 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#2f8e47]">domain</span>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeDescTab === 'hints' && (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-lg text-white">Hints & Approach</h3>
                
                {/* Hint 1 - Always visible */}
                <div className="bg-[#161b22] rounded-xl border border-slate-700/50 overflow-hidden">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#2f8e47]/20 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[#2f8e47] text-lg">lightbulb</span>
                    </span>
                    <span className="text-sm font-bold text-white flex-1 text-left">Hint 1: Key Intuition</span>
                    <span className="material-symbols-outlined text-slate-400 text-lg">
                      {showHint ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                  {showHint && (
                    <div className="px-4 pb-4 border-t border-slate-700/30 pt-3">
                      <p className="text-sm text-slate-300 leading-relaxed">{problem.hint}</p>
                    </div>
                  )}
                </div>

                {/* Approach */}
                <div className="bg-[#2f8e47]/10 border border-[#2f8e47]/20 rounded-xl p-5">
                  <h4 className="font-bold text-sm text-[#2f8e47] mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">psychology</span>
                    Think About
                  </h4>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#2f8e47] mt-0.5">1.</span>
                      What data structure would give you O(1) lookup time?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2f8e47] mt-0.5">2.</span>
                      Can you solve this in a single pass through the data?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2f8e47] mt-0.5">3.</span>
                      What are the edge cases to consider?
                    </li>
                  </ul>
                </div>

                {/* Related Topics */}
                <div>
                  <h4 className="font-bold text-sm text-white mb-2">Related Topics</h4>
                  <div className="flex gap-2 flex-wrap">
                    {problem.tags.map(t => (
                      <span key={t} className="text-xs font-bold bg-[#161b22] text-[#2f8e47] px-3 py-1.5 rounded-full border border-[#2f8e47]/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeDescTab === 'solutions' && (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-lg text-white">Editorial</h3>
                <div className="bg-[#161b22] rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-xl bg-[#2f8e47]/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#2f8e47]">auto_awesome</span>
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">Approach: {problem.tags[0]}</p>
                      <p className="text-[10px] text-slate-400">Optimal Solution</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed space-y-3">
                    <p><strong className="text-[#a3e6b7]">Intuition:</strong> {problem.hint}</p>
                    <p><strong className="text-[#a3e6b7]">Approach:</strong> Use the {problem.tags[0]?.toLowerCase()} technique to efficiently solve this problem.</p>
                    <p><strong className="text-[#a3e6b7]">Complexity:</strong></p>
                    <ul className="text-xs space-y-1 ml-4">
                      <li>• <strong>Time:</strong> O(n) — Single pass through the data</li>
                      <li>• <strong>Space:</strong> O(n) — Additional data structure</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic text-center">💡 Try solving the problem yourself before reading the editorial!</p>
              </div>
            )}
          </div>
        </div>

        {/* Drag Handle */}
        <div
          className="w-1.5 cursor-col-resize hover:bg-[#2f8e47]/50 active:bg-[#2f8e47] transition-colors flex-shrink-0 relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 rounded-full bg-slate-700 group-hover:bg-[#2f8e47]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-xs text-slate-400">drag_indicator</span>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 overflow-y-auto p-4">
          <CodeRunner problem={problem} />
        </div>
      </div>
    </div>
  )
}
