import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const TOPICS = ['All', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'DP', 'Sorting', 'Stack/Queue', 'Math']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

const PROBLEMS = [
  // Arrays
  { id: 1, title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', acceptance: 49.2, likes: 1240, companies: ['Google', 'Amazon', 'Meta'], tags: ['Hash Map', 'Two Pointer'], desc: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9' }], constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists.'], hint: 'Use a hash map to store the complement of each number as you iterate.' },
  { id: 2, title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', acceptance: 54.1, likes: 980, companies: ['Amazon', 'Microsoft'], tags: ['Sliding Window', 'Greedy'], desc: 'You are given an array prices where prices[i] is the price of a given stock on the iᵗʰ day. Maximize profit by choosing a single day to buy and sell.', examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5.' }], constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'], hint: 'Track the minimum price seen so far and the maximum profit at each step.' },
  { id: 3, title: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', acceptance: 50.3, likes: 1580, companies: ['Google', 'Apple', 'Amazon'], tags: ['Kadane\'s Algorithm', 'DP'], desc: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.', examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' }], constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'], hint: "Use Kadane's algorithm: keep a running sum and reset when it goes negative." },
  { id: 4, title: 'Product of Array Except Self', topic: 'Arrays', difficulty: 'Medium', acceptance: 65.0, likes: 1120, companies: ['Meta', 'Amazon', 'Microsoft'], tags: ['Prefix Sum'], desc: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i], without using division.', examples: [{ input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' }], constraints: ['2 ≤ nums.length ≤ 10⁵', '-30 ≤ nums[i] ≤ 30'], hint: 'Use prefix and suffix products in two passes.' },
  { id: 5, title: 'Trapping Rain Water', topic: 'Arrays', difficulty: 'Hard', acceptance: 59.3, likes: 2100, companies: ['Google', 'Amazon', 'Goldman Sachs'], tags: ['Two Pointer', 'Stack', 'DP'], desc: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }], constraints: ['n == height.length', '1 ≤ n ≤ 2 × 10⁴', '0 ≤ height[i] ≤ 10⁵'], hint: 'Use two pointers from both ends, tracking leftMax and rightMax.' },
  // Strings
  { id: 6, title: 'Valid Anagram', topic: 'Strings', difficulty: 'Easy', acceptance: 62.8, likes: 850, companies: ['Google', 'Microsoft'], tags: ['Hash Map', 'Sorting'], desc: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.', examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true' }], constraints: ['1 ≤ s.length, t.length ≤ 5 × 10⁴', 's and t consist of lowercase English letters.'], hint: 'Count character frequencies using a hash map.' },
  { id: 7, title: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'Medium', acceptance: 33.8, likes: 2340, companies: ['Amazon', 'Google', 'Bloomberg'], tags: ['Sliding Window', 'Hash Set'], desc: 'Given a string s, find the length of the longest substring without repeating characters.', examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' }], constraints: ['0 ≤ s.length ≤ 5 × 10⁴', 's consists of English letters, digits, symbols and spaces.'], hint: 'Use a sliding window with a set to track unique characters.' },
  // Linked Lists
  { id: 8, title: 'Reverse Linked List', topic: 'Linked Lists', difficulty: 'Easy', acceptance: 73.4, likes: 1670, companies: ['Google', 'Apple'], tags: ['Iterative', 'Recursive'], desc: 'Given the head of a singly linked list, reverse the list, and return the reversed list.', examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }], constraints: ['The number of nodes is [0, 5000]', '-5000 ≤ Node.val ≤ 5000'], hint: 'Use three pointers: prev, current, and next.' },
  { id: 9, title: 'Merge Two Sorted Lists', topic: 'Linked Lists', difficulty: 'Easy', acceptance: 62.5, likes: 1430, companies: ['Amazon', 'Microsoft'], tags: ['Recursion', 'Linked List'], desc: 'Merge two sorted linked lists and return it as a sorted list.', examples: [{ input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' }], constraints: ['Both lists are sorted in non-decreasing order.'], hint: 'Compare heads of both lists and build the result iteratively.' },
  { id: 10, title: 'Linked List Cycle', topic: 'Linked Lists', difficulty: 'Easy', acceptance: 47.5, likes: 890, companies: ['Amazon', 'Apple'], tags: ['Floyd\'s Algorithm', 'Two Pointer'], desc: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.', examples: [{ input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'There is a cycle connecting tail to the second node.' }], constraints: ['The number of nodes is [0, 10⁴]'], hint: "Use Floyd's tortoise and hare algorithm with slow and fast pointers." },
  // Trees
  { id: 11, title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', acceptance: 73.8, likes: 1280, companies: ['Google', 'Meta'], tags: ['DFS', 'BFS', 'Recursion'], desc: "Given the root of a binary tree, return its maximum depth.", examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3' }], constraints: ['The number of nodes is [0, 10⁴]'], hint: 'Recursively compute 1 + max(leftDepth, rightDepth).' },
  { id: 12, title: 'Lowest Common Ancestor of BST', topic: 'Trees', difficulty: 'Medium', acceptance: 60.2, likes: 1050, companies: ['Meta', 'Microsoft', 'Amazon'], tags: ['BST', 'Recursion'], desc: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes.', examples: [{ input: 'root = [6,2,8,0,4,7,9], p = 2, q = 8', output: '6' }], constraints: ['p and q will exist in the BST.', 'All values are unique.'], hint: 'If both nodes are smaller, go left. If both are larger, go right. Otherwise, current node is LCA.' },
  // Graphs
  { id: 13, title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', acceptance: 56.4, likes: 2100, companies: ['Amazon', 'Google', 'Meta'], tags: ['BFS', 'DFS', 'Union Find'], desc: 'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.', examples: [{ input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2' }], constraints: ['m == grid.length', 'n == grid[i].length', '1 ≤ m, n ≤ 300'], hint: 'Use DFS/BFS to explore and mark connected land cells.' },
  { id: 14, title: "Course Schedule", topic: 'Graphs', difficulty: 'Medium', acceptance: 45.6, likes: 1780, companies: ['Google', 'Amazon', 'Apple'], tags: ['Topological Sort', 'BFS'], desc: 'There are a total of numCourses courses you have to take. Some courses have prerequisites. Return whether it is possible to finish all courses.', examples: [{ input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' }], constraints: ['1 ≤ numCourses ≤ 2000'], hint: 'Use topological sort to detect cycles in the dependency graph.' },
  // DP
  { id: 15, title: 'Climbing Stairs', topic: 'DP', difficulty: 'Easy', acceptance: 51.8, likes: 1540, companies: ['Amazon', 'Google'], tags: ['Dynamic Programming', 'Fibonacci'], desc: 'You are climbing a staircase. It takes n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?', examples: [{ input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' }], constraints: ['1 ≤ n ≤ 45'], hint: "It's the Fibonacci sequence! dp[n] = dp[n-1] + dp[n-2]." },
  { id: 16, title: 'Longest Common Subsequence', topic: 'DP', difficulty: 'Medium', acceptance: 58.9, likes: 1320, companies: ['Google', 'Amazon', 'Microsoft'], tags: ['DP', '2D Table'], desc: 'Given two strings text1 and text2, return the length of their longest common subsequence.', examples: [{ input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: 'The longest common subsequence is "ace".' }], constraints: ['1 ≤ text1.length, text2.length ≤ 1000'], hint: 'Build a 2D DP table where dp[i][j] represents the LCS of text1[0..i-1] and text2[0..j-1].' },
  { id: 17, title: '0/1 Knapsack Problem', topic: 'DP', difficulty: 'Hard', acceptance: 42.1, likes: 1680, companies: ['Google', 'Goldman Sachs'], tags: ['DP', 'Optimization'], desc: 'Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value.', examples: [{ input: 'W = 50, wt = [10,20,30], val = [60,100,120]', output: '220', explanation: 'Take items with weight 20 and 30.' }], constraints: ['1 ≤ n ≤ 1000', '1 ≤ W ≤ 1000'], hint: 'For each item, decide to include or exclude it. Use dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w-wt[i]]).' },
  // Sorting
  { id: 18, title: 'Merge Intervals', topic: 'Sorting', difficulty: 'Medium', acceptance: 46.2, likes: 1890, companies: ['Google', 'Meta', 'Bloomberg'], tags: ['Sorting', 'Intervals'], desc: 'Given an array of intervals, merge all overlapping intervals.', examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }], constraints: ['1 ≤ intervals.length ≤ 10⁴'], hint: 'Sort by start time, then merge consecutive overlapping intervals.' },
  // Stack/Queue
  { id: 19, title: 'Valid Parentheses', topic: 'Stack/Queue', difficulty: 'Easy', acceptance: 40.5, likes: 2200, companies: ['Amazon', 'Google', 'Meta'], tags: ['Stack'], desc: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.', examples: [{ input: 's = "()[]{}"', output: 'true' }], constraints: ['1 ≤ s.length ≤ 10⁴'], hint: 'Use a stack. Push opening brackets, pop and compare for closing brackets.' },
  { id: 20, title: 'Min Stack', topic: 'Stack/Queue', difficulty: 'Medium', acceptance: 52.3, likes: 1350, companies: ['Amazon', 'Microsoft'], tags: ['Stack', 'Design'], desc: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.', examples: [{ input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()', output: '-3, 0, -2' }], constraints: ['Methods pop, top and getMin will always be called on non-empty stacks.'], hint: 'Maintain a second stack that tracks the minimum at each level.' },
  // Math
  { id: 21, title: 'Reverse Integer', topic: 'Math', difficulty: 'Medium', acceptance: 27.6, likes: 1050, companies: ['Amazon', 'Apple'], tags: ['Math'], desc: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing causes overflow, return 0.', examples: [{ input: 'x = 123', output: '321' }, { input: 'x = -123', output: '-321' }], constraints: ['-2³¹ ≤ x ≤ 2³¹ - 1'], hint: 'Use modulo and division to extract digits. Check for overflow before each step.' },
  { id: 22, title: 'Power of Two', topic: 'Math', difficulty: 'Easy', acceptance: 46.3, likes: 620, companies: ['Google'], tags: ['Bit Manipulation'], desc: 'Given an integer n, return true if it is a power of two. Otherwise, return false.', examples: [{ input: 'n = 16', output: 'true' }], constraints: ['-2³¹ ≤ n ≤ 2³¹ - 1'], hint: 'A power of two in binary has exactly one 1 bit. Use n & (n-1) == 0.' },
]

const diffColor = { Easy: 'text-emerald-500', Medium: 'text-amber-500', Hard: 'text-red-500' }
const diffBg = { Easy: 'bg-emerald-500/10 border-emerald-500/20', Medium: 'bg-amber-500/10 border-amber-500/20', Hard: 'bg-red-500/10 border-red-500/20' }

export default function PracticePage() {
  const [activeTopic, setActiveTopic] = useState('All')
  const [activeDiff, setActiveDiff] = useState('All')
  const [expandedProblem, setExpandedProblem] = useState(null)
  const [solvedIds, setSolvedIds] = useState(new Set())
  const [search, setSearch] = useState('')

  const filtered = PROBLEMS.filter(p =>
    (activeTopic === 'All' || p.topic === activeTopic) &&
    (activeDiff === 'All' || p.difficulty === activeDiff) &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  )

  const stats = {
    total: PROBLEMS.length,
    easy: PROBLEMS.filter(p => p.difficulty === 'Easy').length,
    medium: PROBLEMS.filter(p => p.difficulty === 'Medium').length,
    hard: PROBLEMS.filter(p => p.difficulty === 'Hard').length,
    solved: solvedIds.size,
  }

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] text-slate-900 dark:text-slate-100 pt-20 min-h-screen">
      
      {/* Hero */}
      <section className="bg-[#032014] text-white py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#a3e6b7] mb-2">DSA Practice Arena</p>
              <h1 className="serif-headline text-4xl md:text-6xl font-normal mb-4">Code. Solve. Master.</h1>
              <p className="text-slate-300/80 text-lg max-w-xl">Curated coding problems from top tech interviews. Filter by topic, difficulty, and company tags.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Problems</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{stats.easy}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Easy</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{stats.medium}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Medium</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-bold text-red-400">{stats.hard}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Hard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 flex-1 max-w-md">
            <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
            <input className="bg-transparent flex-1 text-sm outline-none placeholder-slate-400 text-slate-900 dark:text-white" placeholder="Search problems, tags..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {/* Difficulty */}
          <div className="flex gap-2">
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setActiveDiff(d)} className={`rounded-full px-4 py-1.5 text-xs font-bold border transition-all ${activeDiff === d ? 'bg-[#2f8e47] border-[#2f8e47] text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-[#2f8e47]/50'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Topic pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TOPICS.map(t => (
            <button key={t} onClick={() => setActiveTopic(t)} className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${activeTopic === t ? 'bg-[#032014] border-[#032014] text-white dark:bg-white dark:border-white dark:text-[#032014]' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#2f8e47]/50'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-8 flex items-center gap-6">
          <div className="flex-1">
            <p className="text-sm font-bold mb-2">Your Progress: <span className="text-[#2f8e47]">{stats.solved}/{stats.total}</span> solved</p>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#2f8e47] to-[#a3e6b7] rounded-full transition-all" style={{ width: `${(stats.solved / stats.total) * 100}%` }} />
            </div>
          </div>
          <Link to="/courses" className="rounded-full bg-[#2f8e47] text-white text-xs font-bold px-5 py-2 hover:bg-[#267a3c] transition-colors whitespace-nowrap">
            View Courses
          </Link>
        </div>

        {/* Problem List */}
        <div className="flex flex-col gap-3">
          {filtered.map(p => (
            <div key={p.id} className={`bg-white dark:bg-[#0d170e] border rounded-2xl overflow-hidden transition-all ${solvedIds.has(p.id) ? 'border-[#2f8e47]/40' : 'border-slate-200 dark:border-slate-800'} hover:shadow-lg`}>
              {/* Problem header */}
              <div
                className="flex items-center gap-4 p-5 cursor-pointer"
                onClick={() => setExpandedProblem(expandedProblem === p.id ? null : p.id)}
              >
                {/* Status */}
                <button
                  onClick={(e) => { e.stopPropagation(); setSolvedIds(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n }) }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${solvedIds.has(p.id) ? 'bg-[#2f8e47] border-[#2f8e47] text-white' : 'border-slate-300 dark:border-slate-600 hover:border-[#2f8e47]'}`}
                >
                  {solvedIds.has(p.id) && <span className="material-symbols-outlined text-sm">check</span>}
                </button>

                {/* Number and Title */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 font-mono">#{p.id}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffBg[p.difficulty]} ${diffColor[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">{p.topic}</span>
                    {p.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] text-[#2f8e47] bg-[#2f8e47]/10 px-2 py-0.5 rounded font-medium">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Meta */}
                <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">thumb_up</span>{p.likes}</span>
                  <span>{p.acceptance}%</span>
                </div>

                {/* Company tags */}
                <div className="hidden lg:flex gap-1">
                  {p.companies.slice(0, 2).map(c => (
                    <span key={c} className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>

                <span className="material-symbols-outlined text-slate-400 text-xl">{expandedProblem === p.id ? 'expand_less' : 'expand_more'}</span>
              </div>

              {/* Expanded view */}
              {expandedProblem === p.id && (
                <div className="border-t border-slate-100 dark:border-white/5 p-6 bg-slate-50/50 dark:bg-white/[0.02]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Problem description */}
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white mb-3">Problem Description</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{p.desc}</p>
                      
                      <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Examples</h5>
                      {p.examples.map((ex, i) => (
                        <div key={i} className="bg-[#032014] rounded-xl p-4 mb-3 font-mono text-xs">
                          <p className="text-slate-400"><strong className="text-[#a3e6b7]">Input:</strong> {ex.input}</p>
                          <p className="text-slate-400 mt-1"><strong className="text-[#a3e6b7]">Output:</strong> {ex.output}</p>
                          {ex.explanation && <p className="text-slate-500 mt-1 italic">// {ex.explanation}</p>}
                        </div>
                      ))}

                      <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 mt-4">Constraints</h5>
                      <ul className="text-xs text-slate-500 space-y-1 mb-4">
                        {p.constraints.map((c, i) => <li key={i} className="flex items-start gap-2"><span className="text-[#2f8e47] mt-0.5">•</span>{c}</li>)}
                      </ul>

                      <div className="bg-[#2f8e47]/10 border border-[#2f8e47]/20 rounded-xl p-4">
                        <p className="text-xs font-bold text-[#2f8e47] mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-sm">lightbulb</span> Hint</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{p.hint}</p>
                      </div>
                    </div>

                    {/* Right: Code editor */}
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white mb-3">Solution</h4>
                      <div className="bg-[#0d1117] rounded-xl overflow-hidden border border-slate-700">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-slate-700">
                          <span className="w-3 h-3 rounded-full bg-red-500/80" />
                          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <span className="w-3 h-3 rounded-full bg-green-500/80" />
                          <span className="text-xs text-slate-400 ml-2 font-mono">solution.py</span>
                        </div>
                        <pre className="p-4 text-sm font-mono text-slate-300 leading-relaxed overflow-x-auto min-h-[200px]">
{`class Solution:
    def solve(self, ${p.id <= 5 ? 'nums' : p.id <= 7 ? 's' : 'head'}):
        # Write your solution here
        pass

# Time Complexity: O(?)
# Space Complexity: O(?)`}
                        </pre>
                      </div>
                      
                      <div className="flex gap-3 mt-4">
                        <button className="flex-1 rounded-xl bg-[#2f8e47] text-white text-sm font-bold py-3 hover:bg-[#267a3c] transition-colors flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-lg">play_arrow</span> Run Code
                        </button>
                        <button className="rounded-xl bg-[#032014] text-white text-sm font-bold py-3 px-6 hover:bg-[#0a3a25] transition-colors flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-lg">check_circle</span> Submit
                        </button>
                      </div>
                      
                      {/* Test cases */}
                      <div className="mt-4 bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Test Cases</p>
                        <div className="flex flex-col gap-2">
                          {p.examples.map((ex, i) => (
                            <div key={i} className="flex items-center gap-3 text-xs">
                              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold">{i + 1}</span>
                              <span className="font-mono text-slate-600 dark:text-slate-400 flex-1 truncate">{ex.input}</span>
                              <span className="text-slate-400">→</span>
                              <span className="font-mono text-[#2f8e47] font-bold">{ex.output}</span>
                              <span className="material-symbols-outlined text-slate-300 text-sm">pending</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Company tags */}
                      <div className="mt-4 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Asked at:</span>
                        {p.companies.map(c => (
                          <span key={c} className="text-[10px] font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
              <p>No problems found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
